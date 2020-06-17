import React from "react";
import { Box, Text, Image, Header } from "grommet";
import { Hpe } from "grommet-icons";

//========================================= Footer
const AppHeader = () => (
  <Header
    align="center"
    direction="row"
    flex={false}
    justify="between"
    gap="medium"
    fill="horizontal"
    pad="medium"
  >
    <Box align="center" justify="center" direction="row" gap="small">
      <Hpe size="large" color="plain" />
      <Box align="center" justify="center" direction="row" gap="xsmall">
        <Text weight="bold">HPE</Text>
        <Text>Hack Shack Challenges On Demand</Text>
      </Box>
    </Box>
    <Box align="center" justify="center" direction="row" gap="xsmall">
      <Box height="xxsmall" width="xxsmall">
        <Image
          fit="contain"
          size="small"
          src="https://us-central1-grommet-designer.cloudfunctions.net/images/lozzi-hpe-com/developer-logo.png"
        ></Image>
      </Box>
      <Text>Powered by</Text>
      <Text weight="bold">HPE DEV</Text>
    </Box>
  </Header>
);

export default AppHeader;
