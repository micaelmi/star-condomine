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
import { Button } from "@/components/ui/button";
import { searchCEP } from "@/lib/utils";
import { MaskedInput } from "../maskedInput";
import { useEffect, useState } from "react";
import { handleFileUpload } from "@/lib/firebase-upload";
import RadioInput from "../form/inputRadio";
import MaskInput from "../form/inputMask";
import DefaultInput from "../form/inputDefault";
import DefaultTextarea from "../form/textareaDefault";
import InputFile from "../form/inputFile";
import TokenInput from "../form/inputToken";
import DefaultCombobox from "../form/comboboxDefault";

const FormSchema = z.object({
  type: z.enum(["CONDOMINIUM", "COMPANY"]),
  cnpj: z.string().min(18),
  name: z.string().min(5),
  responsible: z.string().min(5),
  telephone: z.string().min(10),
  schedules: z.string().min(3),
  exitControl: z.enum(["ACTIVE", "INACTIVE"]),
  protection: z.enum(["ACTIVE", "INACTIVE"]),
  procedures: z.string().optional(),
  cep: z.string().min(9),
  state: z.string().min(2).max(2),
  city: z.string().min(2),
  neighborhood: z.string().min(2),
  street: z.string().min(2),
  number: z.string().min(1),
  complement: z.string().optional(),
  datasheet: z.instanceof(File).optional(),
  code: z.string().min(6, {
    message: "O código deve ter 6 números.",
  }),
  brand: z.number(),
});

export function LobbyForm() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      type: "CONDOMINIUM",
      cnpj: "",
      name: "",
      responsible: "",
      telephone: "",
      schedules: "",
      exitControl: "ACTIVE",
      protection: "INACTIVE",
      procedures: "",
      cep: "",
      state: "",
      city: "",
      neighborhood: "",
      street: "",
      number: "",
      complement: "",
      datasheet: new File([], ""),
      code: "",
      brand: 0,
    },
  });

  const handleBlur = async (cep: string) => {
    const validacep = /^\d{5}-\d{3}$/;
    if (validacep.test(cep)) {
      const address = await searchCEP(cep);

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
  const [isSending, setIsSendind] = useState(false);

  const [brands, setBrands] = useState<Brand[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      if (session)
        try {
          const response = await api.get("brand", {
            headers: {
              Authorization: `Bearer ${session?.token.user.token}`,
            },
          });
          setBrands(response.data);
        } catch (error) {
          console.error("Erro ao obter dados:", error);
        }
    };

    fetchData();
  }, [session]);

  interface item {
    value: number;
    label: string;
  }
  let items: item[] = [];

  brands.map((brand: Brand) =>
    items.push({
      value: brand.controllerBrandId,
      label: brand.name,
    })
  );

  const lobbyTypes = [
    {
      value: "CONDOMINIUM",
      label: "Condomínio",
    },
    {
      value: "COMPANY",
      label: "Empresa",
    },
  ];

  const exitControlOptions = [
    {
      value: "ACTIVE",
      label: "Sim",
    },
    {
      value: "INACTIVE",
      label: "Não",
    },
  ];
  const protectionOptions = [
    {
      value: "ACTIVE",
      label: "Acessível apenas para admins",
    },
    {
      value: "INACTIVE",
      label: "Acessível a todos os usuários",
    },
  ];

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    setIsSendind(true);
    // FAZ O UPLOAD DA FOTO
    let file;
    if (data.datasheet instanceof File && data.datasheet.size > 0) {
      const timestamp = new Date().toISOString();
      const fileExtension = data.datasheet.name.split(".").pop();
      file = await handleFileUpload(
        data.datasheet,
        `portarias/ficha-tecnica-${timestamp}.${fileExtension}`
      );
    } else file = "";

    try {
      const info = {
        type: data.type,
        cnpj: data.cnpj,
        name: data.name,
        responsible: data.responsible,
        telephone: data.telephone,
        schedules: data.schedules,
        exitControl: data.exitControl,
        protection: data.protection,
        procedures: data.procedures,
        cep: data.cep,
        state: data.state,
        city: data.city,
        neighborhood: data.neighborhood,
        street: data.street,
        number: data.number,
        complement: data.complement,
        datasheet: file,
        code: Number(data.code),
        controllerBrandId: data.brand,
      };
      await api.post("lobby", info, {
        headers: {
          Authorization: `Bearer ${session?.token.user.token}`,
        },
      });
      router.back();
    } catch (error) {
      console.error("Erro ao enviar dados para a API:", error);
      throw error;
    } finally {
      setIsSendind(false);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 w-3/4 lg:w-[40%] 2xl:w-1/3"
      >
        <RadioInput
          control={form.control}
          name="type"
          label="Tipo de portaria"
          object={lobbyTypes}
          idExtractor={(item) => item.value}
          descriptionExtractor={(item) => item.label}
        />

        <MaskInput
          control={form.control}
          mask="99.999.999/9999-99"
          name="cnpj"
          label="CNPJ"
          placeholder="Digite o CNPJ da empresa"
        />

        <DefaultInput
          control={form.control}
          name="name"
          label="Nome"
          placeholder="Digite o nome da portaria"
        />

        <DefaultInput
          control={form.control}
          name="responsible"
          label="Responsável"
          placeholder="Digite o nome do responsável da portaria"
        />

        <DefaultInput
          control={form.control}
          name="telephone"
          label="Telefone"
          placeholder="Digite o telefone da empresa"
        />

        <DefaultInput
          control={form.control}
          name="schedules"
          label="Horários"
          placeholder="Quais são os horários do monitoramento?"
        />

        <RadioInput
          control={form.control}
          name="exitControl"
          label="Controle de saída"
          object={exitControlOptions}
          idExtractor={(item) => item.value}
          descriptionExtractor={(item) => item.label}
        />

        <RadioInput
          control={form.control}
          name="protection"
          label="Portaria protegida?"
          object={protectionOptions}
          idExtractor={(item) => item.value}
          descriptionExtractor={(item) => item.label}
        />

        <DefaultTextarea
          control={form.control}
          name="procedures"
          label="Procedimentos gerais"
          placeholder="Quais são os procedimentos a seguir com essa portaria?"
        />

        <InputFile
          control={form.control}
          name="datasheet"
          complement="para ficha técnica"
        />

        <TokenInput
          control={form.control}
          name="code"
          label="Crie um código de acesso"
          size={6}
        />

        <DefaultCombobox
          control={form.control}
          name="brand"
          label="Marca dos dispositivos"
          object={items}
          selectLabel="Selecione uma marca"
          searchLabel="Buscar marca..."
          onSelect={(value: number) => {
            form.setValue("brand", value);
          }}
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
                  autoComplete="off"
                  {...field}
                  onBlur={() => handleBlur(field.value)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <DefaultInput
          control={form.control}
          name="state"
          label="Estado"
          placeholder="Digite o Estado da portaria"
        />

        <DefaultInput
          control={form.control}
          name="city"
          label="Cidade"
          placeholder="Digite a cidade da portaria"
        />

        <DefaultInput
          control={form.control}
          name="neighborhood"
          label="Bairro"
          placeholder="Digite o bairro da portaria"
        />

        <DefaultInput
          control={form.control}
          name="street"
          label="Rua"
          placeholder="Digite a rua da portaria"
        />

        <DefaultInput
          control={form.control}
          type="number"
          name="number"
          label="Número"
          placeholder="Digite o número da portaria"
        />

        <DefaultInput
          control={form.control}
          name="complement"
          label="Complemento"
          placeholder="Alguma informação adicional do endereço"
        />

        <Button type="submit" className="w-full text-lg" disabled={isSending}>
          {isSending ? "Registrando..." : "Registrar"}
        </Button>
      </form>
    </Form>
  );
}
