import {
  Flex,
  Text,
  HStack,
  Box,
  theme,
  useToast,
  Center,
  CircularProgress,
  Menu,
  MenuButton,
  Button,
  MenuList,
  MenuItem,
  Table,
  Thead,
  Tr,
  Th,
  Checkbox,
  Tbody,
  Td,
  Input,
  InputGroup,
  InputLeftElement,
  Icon,
} from "@chakra-ui/react";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import top from "../assets/top.jpg";
import right from "../assets/right.jpg";
import left from "../assets/left.jpg";
import dynamic from "next/dynamic";
import { IGuest, supabaseServices } from "../services/supabase.services";
import { FaAngleDown, FaSearch } from "react-icons/fa";

const Chart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

export default function Dashboard() {
  const [loading, setLoading] = useState(false);
  const [guests, setGuests] = useState<IGuest[]>([]);
  const [guestsList, setGuestsList] = useState<IGuest[]>([]);
  const [menu, setMenu] = useState<"grafico" | "list">("grafico");

  const toast = useToast();

  const labels = ["Confirmado", "Falta Confirmar"];

  const options: ApexCharts.ApexOptions = {
    labels,
    dataLabels: {
      enabled: true,
    },
    colors: [theme.colors.red[500], theme.colors.gray[500]],
    legend: {
      horizontalAlign: "center",
      position: "bottom",
    },
    plotOptions: {
      pie: {
        donut: {
          labels: {
            show: true,
            name: {
              show: true,
              color: theme.colors.black,
              fontSize: theme.fontSizes["2xl"],
            },
            value: {
              show: true,
              color: theme.colors.black,
              fontSize: theme.fontSizes["2xl"],
            },
            total: {
              show: true,
              color: theme.colors.black,
              fontSize: theme.fontSizes["2xl"],
            },
          },
        },
      },
    },
  };

  const series = useMemo(() => {
    const checked = guests.filter((guests) => guests.check).length;
    const unChecked = guests.filter((guests) => !guests.check).length;

    return [checked, unChecked];
  }, [guests]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGuestsList(
      guests.filter((guest) =>
        guest.name.toLowerCase().includes(e.target.value.toLowerCase())
      )
    );
  };

  const fetchAllGuests = useCallback(async () => {
    setLoading(true);
    try {
      const data = await supabaseServices.getAllGuests();

      setGuests(data);
      setGuestsList(data);
    } catch (error) {
      toast({
        duration: 3000,
        status: "error",
        title: "Erro",
        description: "Erro ao buscar os convidados",
        isClosable: true,
        position: "bottom",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchAllGuests();
  }, [fetchAllGuests]);

  if (loading) {
    return (
      <Center height="100vh">
        <CircularProgress isIndeterminate color="red.500" />
      </Center>
    );
  }

  return (
    <Flex
      height="100%"
      minH="100vh"
      direction="column"
      align="center"
      maxW={425}
      mx="auto"
    >
      <Image src={top} alt="" />
      <Menu>
        <MenuButton
          as={Button}
          rightIcon={<FaAngleDown />}
          bgColor="red.500"
          colorScheme="red"
          fontSize="xl"
          mt="2"
        >
          Opções
        </MenuButton>
        <MenuList>
          <MenuItem onClick={() => setMenu("grafico")}>Gráfico</MenuItem>
          <MenuItem onClick={() => setMenu("list")}>
            Lista de convidados
          </MenuItem>
        </MenuList>
      </Menu>

      {menu === "grafico" && (
        <Box my="auto">
          <Chart options={options} series={series} type="donut" width="380" />
        </Box>
      )}
      {menu === "list" && (
        <Flex
          mt="8"
          justify="center"
          direction="column"
          align="center"
          mb="auto"
          borderRadius={8}
          px="2"
          w="100%"
        >
          <InputGroup w="90%" mb="2">
            <InputLeftElement pointerEvents="none">
              <Icon as={FaSearch} color="gray.300" />
            </InputLeftElement>
            <Input
              placeholder="Digite o nome do convidado que deseja buscar"
              onChange={handleSearch}
            />
          </InputGroup>

          <Table colorScheme="red" variant="striped" size="sm">
            <Thead>
              <Tr>
                <Th>ID</Th>
                <Th>Nome</Th>
                <Th>Família</Th>
                <Th>Confirmou?</Th>
              </Tr>
            </Thead>
            <Tbody>
              {guestsList.map((guest) => (
                <Tr key={guest.id}>
                  <Td>{guest.id}</Td>
                  <Td>{guest.name}</Td>
                  <Td>{guest.familyId}</Td>
                  <Td>{guest.check ? "Sim" : "Não"}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Flex>
      )}

      <HStack align="flex-end">
        <Image src={left} alt="" />
        <Image src={right} alt="" />
      </HStack>
    </Flex>
  );
}
