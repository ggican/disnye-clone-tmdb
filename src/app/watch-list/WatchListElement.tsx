"use client";

import React from "react";

import Grid, { GridCol } from "@import/components/Grid";
import MovieCard from "@import/components/MovieCard";
import { useLandingPageContext } from "@import/providers/LandingPageProviders";

import WatchLisStyles from "./WatchList.styles";

export default function WatchListElement() {
  const { localWhishList, onDeletedData, onSelectedData, selectedData } = useLandingPageContext();
  return (
    <div className="container">
      <WatchLisStyles>
        <div className="section--title">
          <h2>Watchlist</h2>
        </div>
        {selectedData?.size > 0 && <button type="button">Delete Selected</button>}
        {localWhishList && localWhishList.length > 0 && (
          <>
            <Grid marginBottom={true}>
              {localWhishList?.map((item: any) => {
                const result = {
                  ...item,
                  backdrop_path: `${process.env.NEXT_PUBLIC_IMAGE}${item?.backdrop_path}`,
                  poster_path: `${process.env.NEXT_PUBLIC_IMAGE}${item?.poster_path}`,
                };
                return (
                  <GridCol key={item?.id} lg={2} sm={2} xs={2} md={2}>
                    <input
                      type="checkbox"
                      checked={selectedData?.has(item?.id)}
                      onChange={() => onSelectedData(item?.id)}
                      value={item?.id}
                    />
                    <MovieCard key={item?.id} {...result}></MovieCard>
                  </GridCol>
                );
              })}
            </Grid>
          </>
        )}
      </WatchLisStyles>
    </div>
  );
}
