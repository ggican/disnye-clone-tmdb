"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import React, { Suspense, useEffect, useState } from "react";

import { IMovieCardProps } from "#src/components/MovieCard/MovieCard.types.jsx";
import Grid, { GridCol } from "@import/components/Grid";
import MovieCard from "@import/components/MovieCard";
import SearchBox from "@import/components/SearchBox";
import debounce from "@import/lib/utils/debounce";
import { ValueWishList, useLandingPageContext } from "@import/providers/LandingPageProviders";
import { getExploreService } from "@import/services/explore-service";

import ExploreStyles from "./Explore.styles";

const DEBOUNCE_DEFAULT_DELAY = 350;

const DEFAULT_DATA = {
  movies: [],
  series: [],
};

function ExplorePageElement() {
  const { onWishList, onCheckWatchList } = useLandingPageContext();
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get("query") || "";

  const [searchValue, setSearchValue] = useState<string>(query);
  const [splitData, setSplitData] = useState(DEFAULT_DATA);
  const { data, isLoading }: any = useQuery({
    queryKey: ["explore-list-search", searchValue],
    queryFn: () => getExploreService(searchValue),
  });

  const handleOnSplitData = () => {
    setSplitData({
      movies: data?.data?.results.filter((item: IMovieCardProps) => item?.media_type === "movie"),
      series: data?.data?.results.filter((item: IMovieCardProps) => item?.media_type === "tv"),
    });
  };

  const handleOnSearch = debounce((value: string) => {
    router.push(`/explore?query=${value}`);
    setSearchValue(value);
    // setSplitData(DEFAULT_DATA);
  }, DEBOUNCE_DEFAULT_DELAY);

  useEffect(() => {
    if (!isLoading) {
      handleOnSplitData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  const handleOnWishList = (values: ValueWishList) => {
    onWishList(values);
  };

  return (
    <div className="container">
      <ExploreStyles>
        <SearchBox
          data-testid="test-id-search-bar"
          onSearch={handleOnSearch}
          value={searchValue}
          placeholder="Movies, shows and more"
          name="search"
        />
        {splitData?.movies && splitData?.movies.length > 0 && (
          <>
            <div className="section--title">
              <h2>Movies Results</h2>
            </div>
            <Grid marginBottom={true}>
              {onCheckWatchList(splitData?.movies)?.map((item: IMovieCardProps, key: number) => {
                const result = {
                  ...item,
                  backdrop_path: `${process.env.NEXT_PUBLIC_IMAGE}${item?.backdrop_path}`,
                  poster_path: `${process.env.NEXT_PUBLIC_IMAGE}${item?.poster_path}`,
                };
                return (
                  <GridCol className="test-id-movie" key={item?.id} lg={2} sm={2} xs={2} md={2}>
                    <MovieCard
                      key={item?.id}
                      {...result}
                      type="movies"
                      onWishList={handleOnWishList}
                    ></MovieCard>
                  </GridCol>
                );
              })}
            </Grid>
          </>
        )}
        {splitData?.series && splitData?.series.length > 0 && (
          <>
            <div className="section--title">
              <h2>Series Results</h2>
            </div>
            <Grid marginBottom={true}>
              {onCheckWatchList(splitData?.series)?.map((item: IMovieCardProps, key: number) => {
                const result = {
                  ...item,
                  backdrop_path: `${process.env.NEXT_PUBLIC_IMAGE}${item?.backdrop_path}`,
                  poster_path: `${process.env.NEXT_PUBLIC_IMAGE}${item?.poster_path}`,
                };
                return (
                  <GridCol className="test-id-series" key={item?.id} lg={2} sm={2} xs={2} md={2}>
                    <MovieCard
                      key={item?.id}
                      {...result}
                      type="series"
                      onWishList={handleOnWishList}
                    ></MovieCard>
                  </GridCol>
                );
              })}
            </Grid>
          </>
        )}
      </ExploreStyles>
    </div>
  );
}

export default function ExplorePage() {
  return (
    <Suspense>
      <ExplorePageElement />
    </Suspense>
  );
}
