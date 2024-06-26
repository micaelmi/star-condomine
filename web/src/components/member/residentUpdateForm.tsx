"use client";
import * as z from "zod";
import api from "@/lib/axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useSession } from "next-auth/react";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "../ui/textarea";
import { MaskedInput } from "../maskedInput";
import { useEffect, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "../ui/command";
import { PlusCircle, Trash, UserCircle } from "@phosphor-icons/react/dist/ssr";
import { deleteFile, handleFileUpload } from "@/lib/firebase-upload";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";

const FormSchema = z.object({
  profileUrl: z.instanceof(File),
  name: z.string().min(5).trim(),
  cpf: z.string(),
  rg: z.string(),
  email: z.string(),
  telephone: z.string(),
  addressType: z.number(),
  address: z.string().min(1),
  comments: z.string(),

  faceAccess: z.boolean().default(false),
  biometricAccess: z.boolean().default(false),
  remoteControlAccess: z.boolean().default(false),
  passwordAccess: z.string(),

  status: z.enum(["ACTIVE", "INACTIVE"]),
});

interface Member {
  memberId: number;
  type: string;
  profileUrl: string;
  name: string;
  rg: string;
  cpf: string;
  email: string;
  comments: string;
  status: "ACTIVE" | "INACTIVE" | undefined;
  faceAccess: string;
  biometricAccess: string;
  remoteControlAccess: string;
  passwordAccess: string;
  addressTypeId: number;
  addressType: {
    addressTypeId: number;
    description: string;
  };
  address: string;
  accessPeriod: Date;
  telephone: {
    telephoneId: number;
    number: string;
  }[];
  position: string;
  createdAt: string;
  updatedAt: string;
  lobbyId: number;
}
interface Values {
  profileUrl: File;
  name: string;
  cpf: string;
  rg: string;
  email: string;
  addressType: number;
  address: string;
  comments: string;
  faceAccess: boolean;
  biometricAccess: boolean;
  remoteControlAccess: boolean;
  passwordAccess: string;
  telephone: string;
  status: "ACTIVE" | "INACTIVE" | undefined;
}
interface Telephone {
  telephoneId: number;
  number: string;
}
interface item {
  value: number;
  label: string;
}
interface IAddressType {
  addressTypeId: number;
  description: string;
}

export function ResidentUpdateForm({
  preloadedValues,
  member,
  phones,
}: {
  preloadedValues: Values;
  member: Member;
  phones: Telephone[];
}) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: preloadedValues,
  });

  let items: item[] = [];

  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);

  const [addressType, setAddressType] = useState([]);
  const [phoneNumber, setPhoneNumber] = useState<string[]>([]);
  let numbers: string[] = [];
  useEffect(() => {
    phones.forEach((phone: Telephone) => {
      if (!numbers.includes(phone.number)) {
        numbers.push(phone.number);
        setPhoneNumber((prev) => [...prev, phone.number]);
      }
    });
  }, []);

  const fetchAddressData = async () => {
    try {
      const response = await api.get("member/address", {
        headers: {
          Authorization: `Bearer ${session?.token.user.token}`,
        },
      });
      setAddressType(response.data);
    } catch (error) {
      console.error("Erro ao obter dados:", error);
    }
  };

  useEffect(() => {
    fetchAddressData();
  }, [session]);

  addressType.map((type: IAddressType) =>
    items.push({
      value: type.addressTypeId,
      label: type.description,
    })
  );

  const addTelephone = (value: string) => {
    if (!phoneNumber.includes(value)) {
      setPhoneNumber([...phoneNumber, value]);
    }
    form.setValue("telephone", "");
  };
  const deleteTelephone = (value: string) => {
    setPhoneNumber(phoneNumber.filter((item) => item !== value));
  };

  const [removeFile, setRemoveFile] = useState(false);
  const [isSending, setIsSendind] = useState(false);
  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    setIsSendind(true);

    // FAZ O UPLOAD DA FOTO
    let file;
    if (removeFile) {
      file = "";
      if (member.profileUrl.length > 0) {
        deleteFile(member.profileUrl);
      }
    } else if (data.profileUrl instanceof File && data.profileUrl.size > 0) {
      const timestamp = new Date().toISOString();
      const fileExtension = data.profileUrl.name.split(".").pop();
      file = await handleFileUpload(
        data.profileUrl,
        `pessoas/foto-perfil-${timestamp}.${fileExtension}`
      );
    } else if (member?.profileUrl) file = member.profileUrl;
    else file = "";

    // REGISTRA O MORADOR
    try {
      const info = {
        profileUrl: file,
        name: data.name,
        cpf: data.cpf,
        rg: data.rg,
        email: data.email,
        addressTypeId: data.addressType,
        address: data.address,
        faceAccess: data.faceAccess.toString(),
        biometricAccess: data.biometricAccess.toString(),
        remoteControlAccess: data.remoteControlAccess.toString(),
        passwordAccess: data.passwordAccess,
        comments: data.comments,
        status: data.status,
      };
      const response = await api.put("member/" + params.get("id"), info, {
        headers: {
          Authorization: `Bearer ${session?.token.user.token}`,
        },
      });

      // REGISTRA OS NÚMEROS DE TELEFONE
      try {
        const res = await api.delete("telephone/member/" + params.get("id"), {
          headers: {
            Authorization: `Bearer ${session?.token.user.token}`,
          },
        });

        if (res) {
          if (phoneNumber[0] != "") {
            try {
              for (let i = 0; i < phoneNumber.length; i++) {
                await api.post(
                  "telephone",
                  {
                    number: phoneNumber[i],
                    memberId: response.data.memberId,
                  },
                  {
                    headers: {
                      Authorization: `Bearer ${session?.token.user.token}`,
                    },
                  }
                );
              }
            } catch (error) {
              console.error(
                "(Telefone) Erro ao enviar dados para a API:",
                error
              );
              throw error;
            }
          }
        }
      } catch (error) {
        console.error("(Tel) Erro ao enviar dados para a API:", error);
        throw error;
      } finally {
        setIsSendind(false);
      }

      router.back();
    } catch (error) {
      console.error("Erro ao enviar dados para a API:", error);
      throw error;
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-3/4 lg:w-[40%] 2xl:w-1/3 space-y-6"
      >
        <div className="flex gap-4 items-center justify-center">
          {member.profileUrl.length > 0 ? (
            <div className="flex flex-col justify-center items-center">
              <img src={member.profileUrl} alt="Foto de perfil" width={80} />
              <p className="text-sm text-center mt-2">Foto atual</p>
              {/* {member.profileUrl} */}
            </div>
          ) : (
            <div className="flex flex-col justify-center items-center">
              <UserCircle className="w-20 h-20" />
              <p className="text-sm text-center mt-2">
                Nenhuma foto <br /> cadastrada
              </p>
            </div>
          )}
          <div className="w-10/12">
            <FormField
              control={form.control}
              name="profileUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nova foto</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        field.onChange(
                          e.target.files ? e.target.files[0] : null
                        )
                      }
                    />
                  </FormControl>
                  <FormDescription>
                    Não preencha esse campo se quiser manter o arquivo anterior
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center space-x-2 mt-2">
              <Checkbox
                id="check"
                onClick={() => {
                  setRemoveFile(!removeFile);
                }}
              />
              <label
                htmlFor="check"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Remover foto - {removeFile ? "sim" : "não"}
              </label>
            </div>
          </div>
        </div>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Digite o nome do morador"
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
                  placeholder="Digite o CPF do morador"
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
                  placeholder="Digite o RG do morador"
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
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>E-mail</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="Digite o email do morador"
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
          name="telephone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Telefone</FormLabel>
              <FormControl>
                <div className="flex w-full items-center space-x-2">
                  <MaskedInput
                    mask="(99) 99999-9999"
                    type="text"
                    placeholder="Digite o número do telefone"
                    autoComplete="off"
                    {...field}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="aspect-square p-1"
                    onClick={() => addTelephone(field.value)}
                  >
                    <PlusCircle size={"32px"} />
                  </Button>
                </div>
              </FormControl>
              <div className="flex gap-2 flex-wrap">
                {phoneNumber.map((telephone, index) => {
                  return (
                    <div
                      key={index}
                      className="text-lg py-2 px-4 mt-2 rounded-md bg-muted flex justify-between items-center gap-2"
                    >
                      <p>{telephone}</p>
                      <Button
                        type="button"
                        variant="outline"
                        className="aspect-square p-1"
                        onClick={() => deleteTelephone(telephone)}
                      >
                        <Trash size={"24px"} />
                      </Button>
                    </div>
                  );
                })}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="addressType"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Tipo de endereço</FormLabel>
              <FormControl>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        className={cn(
                          "justify-between",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value
                          ? items.find((item) => item.value === field.value)
                              ?.label
                          : "Selecione o tipo do endereço"}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="p-0 max-h-[60vh] overflow-x-auto">
                    <Command className="w-full">
                      <CommandInput placeholder="Buscar tipo..." />
                      <CommandEmpty>Nenhum item encontrado.</CommandEmpty>
                      <CommandGroup>
                        {items.map((item) => (
                          <CommandItem
                            value={item.label}
                            key={item.value}
                            onSelect={() => {
                              form.setValue("addressType", item.value);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                item.value === field.value
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            {item.label}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição do endereço</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Digite o endereço do morador"
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
          name="faceAccess"
          render={({ field }) => (
            <div className="flex flex-col gap-4">
              <FormLabel>Formas de acesso</FormLabel>
              <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel className="font-normal">Facial</FormLabel>
                <FormMessage />
              </FormItem>
            </div>
          )}
        />
        <FormField
          control={form.control}
          name="biometricAccess"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center space-x-2 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormLabel className="font-normal">Biometria</FormLabel>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="remoteControlAccess"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center space-x-2 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormLabel className="font-normal">Controle remoto</FormLabel>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="passwordAccess"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Senha</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Digite a senha do morador"
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
          name="comments"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Observações</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Alguma informação adicional..."
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
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="ACTIVE" />
                    </FormControl>
                    <FormLabel className="font-normal">Ativo</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="INACTIVE" />
                    </FormControl>
                    <FormLabel className="font-normal">Inativo</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full text-lg" disabled={isSending}>
          {isSending ? "Atualizando..." : "Atualizar"}
        </Button>
      </form>
    </Form>
  );
}
