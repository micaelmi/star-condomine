"use client";

import * as z from "zod";
import Swal from "sweetalert2";
import api from "@/lib/axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "../ui/textarea";
import { searchCEP } from "@/lib/utils";
import { MaskedInput } from "../maskedInput";

const FormSchema = z.object({
  type: z.enum(["CONDOMINIUM", "COMPANY"]),
  cnpj: z.string(),
  name: z.string(),
  responsible: z.string(),
  telephone: z.string(),
  schedules: z.string(),
  procedures: z.string(),
  datasheet: z.unknown(),
  cep: z.string(),
  state: z.string().max(2),
  city: z.string(),
  neighborhood: z.string(),
  street: z.string(),
  number: z.string(),
  complement: z.string(),
});

export function LobbyForm() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      procedures: "",
      datasheet: "",
      complement: "",
    },
  });

  const handleBlur = async (cep: string) => {
    const validacep = /^\d{5}-\d{3}$/;
    if (validacep.test(cep)) {
      const address = await searchCEP(cep);
      console.log(address);

      if (!address.erro) {
        if (address.uf != "") form.setValue("state", address.uf);
        if (address.localidade != "") form.setValue("city", address.localidade);
        if (address.bairro != "") form.setValue("neighborhood", address.bairro);
        if (address.logradouro != "")
          form.setValue("street", address.logradouro);
      } else {
        Swal.fire({
          title: "CEP inválido",
          text: "O CEP informado não existe",
          icon: "warning",
        });
      }
    }
  };

  const { data: session } = useSession();
  const router = useRouter();
  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    console.log(data);
    // return;
    try {
      const response = await api.post("lobby", data, {
        headers: {
          Authorization: `Bearer ${session?.token.user.token}`,
        },
      });
      console.log(response.data);
      router.push("/dashboard");
    } catch (error) {
      console.error("Erro ao enviar dados para a API:", error);
      throw error;
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-3/4 lg:w-1/3 space-y-6"
      >
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo de portaria</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="CONDOMINIUM" />
                    </FormControl>
                    <FormLabel className="font-normal">Condomínio</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="COMPANY" />
                    </FormControl>
                    <FormLabel className="font-normal">Empresa</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="cnpj"
          render={({ field }) => (
            <FormItem>
              <FormLabel>CNPJ</FormLabel>
              <FormControl>
                <MaskedInput
                  mask="99.999.999/9999-99"
                  placeholder="Digite o CNPJ da empresa"
                  autoComplete="off"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Digite o nome da empresa"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="responsible"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Responsável</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Digite o nome do responsável da empresa"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="telephone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Telefone</FormLabel>
              <FormControl>
                <MaskedInput
                  mask="(99) 99999-9999"
                  type="text"
                  placeholder="Digite o telefone da empresa"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="schedules"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Horários</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Quais são os horários do monitoramento?"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="procedures"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Procedimentos gerais</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Quais são os procedimentos a seguir com essa portaria?"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="datasheet"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ficha técnica</FormLabel>
              <FormControl>
                <Input type="file" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="cep"
          render={({ field }) => (
            <FormItem>
              <FormLabel>CEP</FormLabel>
              <FormControl>
                <MaskedInput
                  mask="99999-999"
                  type="text"
                  placeholder="Digite o CEP da portaria"
                  {...field}
                  onBlur={() => handleBlur(field.value)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="state"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Estado</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Digite o Estado da portaria"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="city"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cidade</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Digite a cidade da portaria"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="neighborhood"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bairro</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Digite o bairro da portaria"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="street"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Rua</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Digite a rua da portaria"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="number"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Número</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Digite o número da portaria"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="complement"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Complemento</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Alguma informação adicional do endereço"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full text-lg">
          Registrar
        </Button>
      </form>
    </Form>
  );
}
