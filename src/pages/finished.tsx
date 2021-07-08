import { Box, Flex, Text, HStack } from "@chakra-ui/react";
import React from "react";
import Image from "next/image";
import top from "../assets/top.jpg";
import right from "../assets/right.jpg";
import left from "../assets/left.jpg";

export default function Finished() {
  return (
    <Flex height="100vh" direction="column" align="center" maxW={425} mx="auto">
      <Image src={top} alt="" />

      <Text align="center" my="auto" fontSize="2xl" px="4">
        Muito obrigado pela confirmação, aguardamos você e sua família em nossa
        festa!
      </Text>

      <HStack align="flex-end">
        <Image src={left} alt="" />
        <Image src={right} alt="" />
      </HStack>
    </Flex>
  );
}
