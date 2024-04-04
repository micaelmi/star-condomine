"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import api from "@/lib/axios";
import {
  MagnifyingGlass,
  PencilLine,
  Trash,
} from "@phosphor-icons/react/dist/ssr";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { SkeletonTable } from "../_skeletons/skeleton-table";
import { deleteAction } from "@/lib/delete-action";

interface Visitor {
  visitorId: number;
  profileUrl: string;
  name: string;
  rg: string;
  cpf: string;
  phone: string;
  status: string;
  relation: string;
  comments: string;
  createdAt: string;
  updatedAt: string;
  visitorType: {
    visitorTypeId: number;
    description: string;
  };
  scheduling: [
    {
      schedulingId: number;
    }
  ];
}

export default function VisitorTable({ lobby }: { lobby: string }) {
  const [isLoading, setIsLoading] = useState(true);
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const control = params.get("c");
  const fetchData = async () => {
    try {
      let path;
      if (!params.get("query")) {
        path = "visitor/lobby/" + lobby;
      } else {
        path = `visitor/filtered/${lobby}?query=${params.get("query")}`;
      }
      const response = await api.get(path, {
        headers: {
          Authorization: `Bearer ${session?.token.user.token}`,
        },
      });
      setVisitors(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error("Erro ao obter dados:", error);
    }
  };
  useEffect(() => {
    fetchData();
  }, [session, searchParams]);

  const deleteVisitor = async (id: number) => {
    deleteAction(session, "visitante", `visitor/${id}`, fetchData);
  };

  return (
    <>
      {isLoading ? (
        <SkeletonTable />
      ) : (
        <Table className="border border-stone-800 rouded-lg">
          <TableHeader className="bg-stone-800 font-semibold">
            <TableRow>
              <TableHead>CPF</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Agendamento</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="uppercase">
            {visitors.map((visitor) => (
              <TableRow key={visitor.visitorId}>
                <TableCell>{visitor.cpf}</TableCell>
                <TableCell>{visitor.name}</TableCell>
                <TableCell>{visitor.visitorType.description}</TableCell>
                <TableCell>
                  {visitor.scheduling.length > 0 ? (
                    <Link
                      href={`scheduling?lobby=${lobby}&c=${control}&query=${visitor.name}`}
                      className="text-green-300 flex gap-1 items-center"
                    >
                      Sim - <MagnifyingGlass size={18} />
                    </Link>
                  ) : (
                    <p className="text-red-200">Não</p>
                  )}
                </TableCell>
                <TableCell>
                  {visitor.status === "ACTIVE" ? (
                    <p className="text-green-500">ATIVO</p>
                  ) : (
                    <p className="text-red-400">BLOQUEADO</p>
                  )}
                </TableCell>
                <TableCell className="flex gap-4 text-2xl">
                  <Link href={`visitor/details?id=${visitor.visitorId}`}>
                    <MagnifyingGlass />
                  </Link>
                  <Link
                    href={`visitor/update?id=${visitor.visitorId}&lobby=${lobby}`}
                  >
                    <PencilLine />
                  </Link>
                  <button
                    onClick={() => deleteVisitor(visitor.visitorId)}
                    title="Excluir"
                  >
                    <Trash />
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell className="text-right" colSpan={6}>
                Total de registros: {visitors.length}
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      )}
    </>
  );
}
