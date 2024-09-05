import React from "react";
import { Image, VStack, Text, Box } from "@chakra-ui/react";

const Workflow: React.FC = () => {
  return (
    <Box
      mx="auto"
      width="1280px"
      p={4}
      marginTop="20px"
      borderRadius="0"
      borderWidth="1.5px"
      borderColor="black"
      bg="white"
      padding={6}
    >
      <VStack spacing={4} align="start">
        <Text variant="title">Workflow</Text>
        <Text variant="description">
          The flowchart below shows the simplified workflow of our project.
        </Text>
        {/* <Center width="100%" p="2" bg="white"> */}
        <Image
          src={`${process.env.PUBLIC_URL}/zkaa-workflow2.png`}
          alt="Workflow Diagram"
          maxWidth="100%"
          height="auto"
          objectFit="contain"
        />
        {/* </Center> */}
      </VStack>
    </Box>
  );
};

export default Workflow;
