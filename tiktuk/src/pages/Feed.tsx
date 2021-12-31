import React, { useEffect, useState } from "react";
import { Typography, Pagination, Grid } from "@mui/material";
import InView from "react-intersection-observer";

import Post from "../components/Post/Post";
import { getTrendingFeed } from "../api/apiCalls";
import { TrendingFeedItem } from "../common/types";

interface FeedProp {
  postsPerPage: number;
  postsCount: number;
}

const Feed = ({ postsPerPage, postsCount }: FeedProp) => {
  const [posts, setPosts] = useState<TrendingFeedItem[]>([]);
  const [playingVideo, setPlayingVideo] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const getFeed = async () => {
      const response = await getTrendingFeed();
      setPosts(response);
      setPlayingVideo(response[0].id);
    };

    getFeed();
  }, []);

  const onVideoClick = (id: string) => {
    setPlayingVideo((currId) => (currId === id ? "" : id));
  };

  const videoinView = (id: string) => {
    setPlayingVideo(id);
  };

  const postsOnPage = posts.slice(
    postsPerPage * (currentPage - 1),
    postsPerPage * currentPage
  );
  return (
    <>
      <Grid container direction="column" alignContent="center" spacing={2}>
        {postsOnPage.length ? (
          postsOnPage.map((post) => (
            <Grid item key={post.id}>
              <InView
                threshold={0.8}
                as="div"
                onChange={(isInView, entry) => {
                  if (isInView) {
                    videoinView(post.id);
                  }
                }}
              >
                <Post
                  {...post}
                  onClick={onVideoClick}
                  playing={playingVideo === post.id}
                  videoId={post.id}
                />
              </InView>
            </Grid>
          ))
        ) : (
          <Typography>Loading...</Typography>
        )}
      </Grid>
      <Grid container justifyContent="center" marginTop={2}>
        <Pagination
          count={Math.ceil(postsCount / postsPerPage)}
          onChange={(e, page) => {
            setCurrentPage(page);
          }}
        />
      </Grid>
    </>
  );
};

export default Feed;
