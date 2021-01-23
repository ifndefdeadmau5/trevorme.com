import React, { useState } from "react";
import Typography from "@material-ui/core/Typography";
import Header from "./components/Header";
import OSS from "./components/OSS";
import styled from "styled-components";
import Footer from "./components/Footer";

const PAGE_HOME = 0;
const PAGE_OSS = 1;

const Main = styled.div({
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  minHeight: "100vh",
});
const MarginContainer = styled.div({
  marginTop: 64,
  marginBottom: 64,
  marginLeft: "auto",
  marginRight: "auto",
});
const ContentWrapper = styled.div({
  width: 550,
});

const ThemedBackground = styled.div(({ theme }) => ({
  background: theme.palette.background.paper,
}));

export default ({ darkSwitch }) => {
  const [page, setPage] = useState(PAGE_OSS);
  return (
    <ThemedBackground>
      <Header onSelect={setPage}>{darkSwitch}</Header>
      <Main>
        <MarginContainer>
          {page === PAGE_HOME && (
            <ContentWrapper>
              <Typography color="textPrimary">
                {Array.apply(null, Array(50))
                  .map(
                    () => `Cras mattis consectetur purus sit amet fermentum.
Cras justo odio, dapibus ac facilisis in, egestas eget quam.
Morbi leo risus, porta ac consectetur ac, vestibulum at eros.
Praesent commodo cursus magna, vel scelerisque nisl consectetur et.`
                  )
                  .join("\n")}
              </Typography>
            </ContentWrapper>
          )}
          {page === PAGE_OSS && <OSS />}
        </MarginContainer>
        <Footer />
      </Main>
    </ThemedBackground>
  );
};
