// pages/index.js
import Head from "next/head";
import {
  Box,
  Container,
  Text,
  Wrap,
  WrapItem,
  WrapItemInput,
  IconButton,
  Input,
  InputRightElement,
  InputGroup,
  useToast,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import { getCuratedPhotos, getQueryPhotos } from "../lib/api";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function Home({ data }) {
  const [query, setQuery] = useState("");
  const [photos, setPhotos] = useState(data);
  const toast = useToast();

  const handleSubmit = async (e) => {
    await e.preventDefault();
    if (query == "") {
      toast({
        title: "Error.",
        description: "Empty Search",
        status: "error",
        duration: 9000,
        isClosable: true,
        position: "top",
      });
    } else {
      const res = await getQueryPhotos(query);
      await setPhotos(res);
      await setQuery("");
    }
  };

  return (
    <div>
      <Head>
        <title> NextJS Image Gallery</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Box overflow="hidden" bg="purple.400" minH="100vh">
        <Container>
          <Text
            color="pink.800"
            fontWeight="semibold"
            mb="2rem"
            textAlign="center"
            
            fontSize={["4xl", "4xl", "5xl", "5xl"]}
          >
            NextJS Image Gallery
          </Text>
          <form onSubmit={handleSubmit}>
            <InputGroup pb="2rem">
              <Input
                placeholder="Search a photo"
                variant="ghost"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />

              <InputRightElement
                children={
                  <IconButton
                    aria-label="Search"
                    icon={<SearchIcon />}
                    onClick={handleSubmit}
                    bg="pink.500"
                    color="white"
                  />
                }
              />
            </InputGroup>
          </form>
        </Container>
        <Wrap px="1rem" spacing={4} justify="center">
          {photos.map((pic) => (
            <WrapItem
              key={pic.id}
              boxShadow="base"
              rounded="25px"
              overflow="hidden"
              bg="white"
              lineHeight="0"
              _hover={{ boxShadow: "dark-lg" }}
            >
              <Link href={`/photos/${pic.id}`}>
                <a>
                  <Image
                    src={pic.src.portrait}
                    width="200"
                    height="300"
                    alt="{pic.url}"
                  />
                </a>
              </Link>
            </WrapItem>
          ))}
        </Wrap>
      </Box>
    </div>
  );
}
export async function getServerSideProps() {
  const data = await getCuratedPhotos();
  return {
    props: {
      data,
    },
  };
}
