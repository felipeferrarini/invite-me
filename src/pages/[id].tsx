import {
  Flex,
  Checkbox,
  Text,
  VStack,
  Button,
  HStack,
  Box,
  CheckboxGroup,
  FormControl,
  FormErrorMessage,
  CircularProgress,
  useToast,
} from "@chakra-ui/react";
import React, { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import top from "../assets/top.jpg";
import right from "../assets/right.jpg";
import left from "../assets/left.jpg";
import { Formik, Form } from "formik";
import * as yup from "yup";
import { IGuest, supabaseServices } from "../services/supabase.services";
import { useRouter } from "next/router";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [guests, setGuests] = useState<IGuest[]>([]);
  const router = useRouter();
  const { id } = router.query;
  const toast = useToast();

  const validation = yup.object().shape({
    guestIds: yup
      .array()
      .of(yup.number())
      .min(1, "É necessário marcar pelo menos um convidado!"),
  });

  const initialValues = {
    guestIds: [] as string[],
  };

  const handleSubmit = async (values: typeof initialValues) => {
    console.log(values);
    try {
      const promisesToCheck = values.guestIds.map(async (id) => {
        const result = await supabaseServices.checkGuest(Number(id), true);
        return result;
      });

      const guestIdsToUncheck = guests
        .filter((guest) => !values.guestIds.includes(`${guest.id}`))
        .map((guest) => guest.id);

      const promisesToUncheck = guestIdsToUncheck.map(async (id) => {
        const result = await supabaseServices.checkGuest(Number(id), false);
        return result;
      });

      const result = await Promise.all([
        ...promisesToCheck,
        ...promisesToUncheck,
      ]);

      if (result.every((r) => r)) {
        toast({
          title: "Sucesso",
          description: "Sua confirmação foi enviada!",
          status: "success",
          duration: 3000,
          isClosable: true,
          onCloseComplete: () => {
            router.replace("/finished");
          },
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchGuests = useCallback(async () => {
    setLoading(true);
    if (id) {
      try {
        const data = await supabaseServices.getGuests(Number(id));
        setGuests(data);
      } catch (err) {
        toast({
          title: "Erro",
          description: "Erro ao buscar convidados, por favor tente novamente.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    }
  }, [id, toast]);

  useEffect(() => {
    fetchGuests();
  }, [fetchGuests]);

  return (
    <Flex height="100vh" direction="column" maxW={425} mx="auto">
      <Image src={top} alt="" />
      <Flex direction="column" alignItems="center" justify="center">
        <Text align="center" mt="6">
          É um prazer ter você e sua família como convidados, por favor confirme
          a presença de todos que irão:
        </Text>
        {loading ? (
          <CircularProgress isIndeterminate color="red.500" my="6" />
        ) : (
          <Formik
            initialValues={initialValues}
            onSubmit={handleSubmit}
            validationSchema={validation}
          >
            {({ isSubmitting, values, errors, touched, setFieldValue }) => (
              <Form>
                <Flex direction="column" align="center">
                  <CheckboxGroup
                    value={values.guestIds}
                    onChange={(value) => setFieldValue("guestIds", value)}
                  >
                    <VStack mt="6" align="flex-start">
                      {guests.map((guest) => (
                        <Checkbox
                          size="lg"
                          colorScheme="red"
                          value={`${guest.id}`}
                          key={guest.id}
                          color="red.500"
                        >
                          <Text fontSize="xl">{guest.name}</Text>
                        </Checkbox>
                      ))}
                    </VStack>
                  </CheckboxGroup>
                  <FormControl isInvalid={errors.guestIds && touched.guestIds}>
                    <FormErrorMessage>{errors.guestIds}</FormErrorMessage>
                  </FormControl>

                  <Button
                    size="lg"
                    mt="10"
                    isLoading={isSubmitting}
                    type="submit"
                    colorScheme="red"
                    bg="red.500"
                  >
                    Confirmar
                  </Button>
                </Flex>
              </Form>
            )}
          </Formik>
        )}
      </Flex>
      <HStack mt="auto">
        <Image src={left} alt="" />
        <Image src={right} alt="" />
      </HStack>
    </Flex>
  );
}
