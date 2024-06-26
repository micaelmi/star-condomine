"use client";
import * as z from "zod";
import api from "@/lib/axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MaskedInput } from "@/components/maskedInput";
import { useEffect, useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { handleFileUpload } from "@/lib/firebase-upload";
import { decrypt } from "@/lib/crypto";
import Image from "next/image";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";

const FormSchema = z.object({
  profileUrl: z.instanceof(File).refine((file) => file.size > 0, {
    message: "Um arquivo deve ser selecionado",
  }),
  name: z.string().min(5, {
    message: "Por favor, insira o nome completo",
  }),
  cpf: z.string().min(11, {
    message: "Preencha o CPF corretamente",
  }),
  rg: z.string().min(8, {
    message: "Preencha o RG corretamente",
  }),
  phone: z.string().min(10, {
    message: "Preencha o telefone corretamente",
  }),
  type: z.string(),
  relation: z.string().min(1, {
    message: "Preencha o este campo",
  }),
  comments: z.string().min(1, {
    message: "Preencha o este campo",
  }),
  facial: z.boolean(),
  terms: z.boolean(),
});

export function VisitorForm() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      profileUrl: new File([], ""),
      name: "",
      cpf: "",
      rg: "",
      phone: "",
      type: "1",
      relation: "",
      comments: "",
      facial: false,
      terms: false,
    },
  });

  const router = useRouter();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const lobby = params.get("lobby") || "";

  interface VisitorTypes {
    visitorTypeId: number;
    description: string;
  }

  const [visitorType, setVisitorType] = useState<VisitorTypes[]>([]);
  const fetchVisitorTypes = async () => {
    try {
      const response = await api.get("guest/visitor/types");
      setVisitorType(response.data);
    } catch (error) {
      console.error("Erro ao obter dados:", error);
    }
  };

  useEffect(() => {
    fetchVisitorTypes();
  }, []);

  const [isSendind, setIsSending] = useState(false);
  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    setIsSending(true);

    // FAZ O UPLOAD DA FOTO
    let file;
    if (data.profileUrl instanceof File && data.profileUrl.size > 0) {
      const timestamp = new Date().toISOString();
      const fileExtension = data.profileUrl.name.split(".").pop();
      file = await handleFileUpload(
        data.profileUrl,
        `pessoas/foto-perfil-visita-${timestamp}.${fileExtension}`
      );
    } else file = "";

    // REGISTRA O visitante
    try {
      const info = {
        profileUrl: file,
        name: data.name,
        cpf: data.cpf,
        rg: data.rg,
        phone: data.phone,
        visitorTypeId: Number(data.type),
        relation: data.relation,
        comments: data.facial
          ? "FACIAL AUTORIZADA - ".concat(data.comments)
          : "FACIAL NÃO AUTORIZADA - ".concat(data.comments),
        startDate: null,
        endDate: null,
        status: "INACTIVE",
        lobbyId: decrypt(lobby),
      };
      await api.post("guest/visitor", info);

      router.push("visitor/success?lobby=" + lobby);
    } catch (error) {
      console.error("Erro ao enviar dados para a API:", error);
      throw error;
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-3/4 lg:w-[40%] 2xl:w-1/3 space-y-6"
      >
        <FormField
          control={form.control}
          name="profileUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Foto</FormLabel>
              <Image
                src="/photo-guide.jpeg"
                alt="Requisitos de foto"
                width={967}
                height={911}
                priority={true}
                className="rounded-md"
              />
              <FormControl>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    field.onChange(e.target.files ? e.target.files[0] : null)
                  }
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
              <FormLabel>Nome completo</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Digite o nome do visitante"
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
          name="cpf"
          render={({ field }) => (
            <FormItem>
              <FormLabel>CPF</FormLabel>
              <FormControl>
                <MaskedInput
                  mask="999.999.999/99"
                  placeholder="Digite o CPF do visitante"
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
          name="rg"
          render={({ field }) => (
            <FormItem>
              <FormLabel>RG</FormLabel>
              <FormControl>
                <Input
                  placeholder="Digite o RG do visitante"
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
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Telefone</FormLabel>
              <FormControl>
                <MaskedInput
                  mask="(99) 99999-9999"
                  type="text"
                  placeholder="Digite o telefone do visitante"
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
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo de visitante</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  {visitorType.map((type) => {
                    return (
                      <FormItem
                        className="flex items-center space-x-3 space-y-0"
                        key={type.visitorTypeId}
                      >
                        <FormControl>
                          <RadioGroupItem
                            value={type.visitorTypeId.toString()}
                          />
                        </FormControl>
                        <FormLabel className="font-normal">
                          {type.description}
                        </FormLabel>
                      </FormItem>
                    );
                  })}
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="relation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Relação / Empresa</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Qual é a relação desse visitante com a portaria?"
                  autoComplete="off"
                  {...field}
                />
              </FormControl>
              <FormMessage />
              <FormDescription>
                Exemplo: familiar, filho de proprietário, jardineiro...
              </FormDescription>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="comments"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome e endereço do proprietário</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Escreva aqui qual é o nome completo e o endereço do proprietário"
                  autoComplete="off"
                  {...field}
                />
              </FormControl>
              <FormMessage />
              <FormDescription>Exemplo: João Silva, LOTE 32</FormDescription>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="facial"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>
                  Autorizar acesso facial, confirmando ciência do{" "}
                  <Link
                    href="/Termo_de_responsabilidade_de_cadastro_de_visitante.pdf"
                    target="_blank"
                    className="underline text-primary"
                  >
                    termo de responsabilidade
                  </Link>
                  .
                </FormLabel>
              </div>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="terms"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>
                  Aceito as{" "}
                  <Link
                    href="/Politicas_privacidade_Star_Seg.pdf"
                    target="_blank"
                    className="underline text-primary"
                  >
                    políticas de privacidade
                  </Link>{" "}
                  da empresa, regidas a partir da Lei Nº 13.709 (Lei Geral de
                  Proteção de Dados).
                </FormLabel>
              </div>
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="w-full text-lg"
          disabled={form.getValues("terms") === false || isSendind}
        >
          Registrar
        </Button>
      </form>
    </Form>
  );
}
