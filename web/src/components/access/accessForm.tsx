"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import api from "@/lib/axios";
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
import { useSearchParams } from "next/navigation";
import { Checkbox } from "../ui/checkbox";
import { Textarea } from "../ui/textarea";
import { format } from "date-fns";

const FormSchema = z.object({
  visitor: z.number(),
  member: z.number(),
  reason: z.string(),
  local: z.string(),
  startTime: z.string(),
  comments: z.string(),
  currentDate: z.boolean(),
});

export function AccessForm() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      visitor: 0,
      member: 0,
      reason: "",
      local: "",
      startTime: "",
      comments: "",
      currentDate: false,
    },
  });

  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);

  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const fetchVisitors = async () => {
    try {
      const response = await api.get("visitor/lobby/" + params.get("lobby"), {
        headers: {
          Authorization: `Bearer ${session?.token.user.token}`,
        },
      });
      setVisitors(response.data);
    } catch (error) {
      console.error("Erro ao obter dados:", error);
    }
  };

  const [members, setMembers] = useState<Member[]>([]);
  const fetchMembers = async () => {
    try {
      const response = await api.get("member/lobby/" + params.get("lobby"), {
        headers: {
          Authorization: `Bearer ${session?.token.user.token}`,
        },
      });
      setMembers(response.data);
    } catch (error) {
      console.error("Erro ao obter dados:", error);
    }
  };

  useEffect(() => {
    fetchVisitors();
    fetchMembers();
  }, [session]);

  interface visitorItem {
    value: number;
    label: string;
    openAccess: boolean;
  }

  interface memberItem {
    value: number;
    label: string;
    addressType: string | null;
    address: string | null;
    comments: string;
  }

  let visitorItems: visitorItem[] = [];
  visitors.map((visitor: Visitor) => {
    if (visitor.status === "ACTIVE") {
      visitorItems.push({
        value: visitor.visitorId,
        label: visitor.name,
        openAccess:
          visitor.access.length > 0 && visitor.lobby.exitControl === "ACTIVE"
            ? true
            : false,
      });
    }
  });

  let memberItems: memberItem[] = [];
  members.map((member: Member) => {
    if (member.status === "ACTIVE") {
      memberItems.push({
        value: member.memberId,
        label: member.name,
        addressType:
          member.addressTypeId !== null ? member.addressType.description : "",
        address: member.address !== null ? member.address : "",
        comments: member.comments !== null ? member.comments : "",
      });
    }
  });

  const [isSending, setIsSendind] = useState(false);
  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    setIsSendind(true);
    const lobbyParam = params.get("lobby");
    const lobby = lobbyParam ? parseInt(lobbyParam, 10) : null;
    const operator = session?.payload.user.id || null;

    let realDate = "";
    if (data.startTime !== "") {
      const dateObject = new Date(data.startTime);
      dateObject.setHours(dateObject.getHours() + 3);
      realDate = format(dateObject, "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");
    }
    if (data.currentDate) realDate = new Date().toISOString();

    const info = {
      startTime: realDate,
      local: data.local,
      reason: data.reason,
      comments: data.comments,
      memberId: data.member,
      visitorId: data.visitor,
      operatorId: operator,
      lobbyId: lobby,
    };
    try {
      await api.post("access", info, {
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
        className="w-3/4 lg:w-[40%] 2xl:w-1/3 space-y-6"
      >
        <FormField
          control={form.control}
          name="visitor"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Visitante</FormLabel>
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
                        ? visitorItems.find(
                            (item) => item.value === field.value
                          )?.label
                        : "Selecione o visitante que está acessando"}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="p-0 max-h-[60vh] overflow-x-auto">
                  <Command className="w-full">
                    <CommandInput placeholder="Buscar visitante..." />
                    <CommandEmpty>Nenhum item encontrado.</CommandEmpty>
                    <CommandGroup>
                      {visitorItems.map((item) => (
                        <CommandItem
                          value={item.label}
                          key={item.value}
                          onSelect={() => {
                            form.setValue("visitor", item.value);
                          }}
                          className={cn(
                            item.openAccess && "text-red-400 font-semibold"
                          )}
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
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="member"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Morador visitado / colaborador acionado</FormLabel>
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
                        ? memberItems.find((item) => item.value === field.value)
                            ?.label
                        : "Selecione quem está sendo visitado"}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="p-0 max-h-[60vh] overflow-x-auto">
                  <Command className="w-full">
                    <CommandInput placeholder="Buscar pessoa..." />
                    <CommandEmpty>Nenhum item encontrado.</CommandEmpty>
                    <CommandGroup>
                      {memberItems.map((item) => (
                        <CommandItem
                          value={item.label}
                          key={item.value}
                          onSelect={() => {
                            form.setValue("member", item.value);
                          }}
                          className={cn(
                            item.comments.length > 0 &&
                              "text-yellow-400 font-semibold"
                          )}
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
                          {item.address ? (
                            <>
                              {" "}
                              - {item.addressType} {item.address}
                            </>
                          ) : (
                            ""
                          )}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="reason"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Motivo</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Por que está sendo feita essa visita?"
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
          name="local"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Local da visita</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Para onde está indo? Casa, Salão de Festas..."
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
          name="startTime"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Data e hora do acesso</FormLabel>
              <FormControl>
                <Input
                  type="datetime-local"
                  placeholder="Data e hora"
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
          name="currentDate"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center space-x-2 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormLabel className="font-normal">
                Utilizar data e hora atuais
              </FormLabel>
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
                  placeholder="Alguma informação adicional. Exemplo: Placa do veículo"
                  autoComplete="off"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full text-lg" disabled={isSending}>
          {isSending ? "Registrando..." : "Registrar"}
        </Button>
      </form>
    </Form>
  );
}
