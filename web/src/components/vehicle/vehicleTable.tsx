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
import { PencilLine, Trash } from "@phosphor-icons/react/dist/ssr";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

interface Vehicle {
  vehicleId: number;
  lecensePlate: string;
  brand: string;
  model: string;
  color: string;
  tag: string;
  comments: string;
  vehicleTypeId: number;
  memberId: number;
}

export default function VehicleTable({ lobby }: { lobby: string }) {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const { data: session } = useSession();
  const fetchData = async () => {
    try {
      let path = "vehicle/member/" + lobby;
      const response = await api.get(path, {
        headers: {
          Authorization: `Bearer ${session?.token.user.token}`,
        },
      });
      setVehicles(response.data);
    } catch (error) {
      console.error("Erro ao obter dados:", error);
    }
  };
  useEffect(() => {
    fetchData();
  }, [session]);

  const deleteAction = async (id: number) => {
    try {
      await api.delete("member/" + id, {
        headers: {
          Authorization: `Bearer ${session?.token.user.token}`,
        },
      });
      fetchData();
      Swal.fire({
        title: "Excluído!",
        text: "Esse membro da portaria acabou de ser apagado.",
        icon: "success",
      });
    } catch (error) {
      console.error("Erro excluir dado:", error);
    }
  };

  const deleteVehicle = async (id: number) => {
    Swal.fire({
      title: "Excluir membro?",
      text: "Essa ação não poderá ser revertida!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#43C04F",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sim, excluir!",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteAction(id);
      }
    });
  };

  return (
    <Table className="border border-stone-800 rouded-lg">
      <TableHeader className="bg-stone-800 font-semibold">
        <TableRow>
          <TableHead>Tipo de veículo</TableHead>
          <TableHead>Placa</TableHead>
          <TableHead>Tag do veículo</TableHead>
          <TableHead>Marca</TableHead>
          <TableHead>Modelo</TableHead>
          <TableHead>Cor</TableHead>
          <TableHead>Observação</TableHead>
          <TableHead>Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {vehicles.map((vehicle) => {
          return (
            <TableRow key={vehicle.vehicleId}>
              <TableCell></TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
              <TableCell className="flex gap-4 text-2xl">
                <Link
                  href={`vehicle/update?id=${vehicle.vehicleId}&lobby=${lobby}`}
                >
                  <PencilLine />
                </Link>
                <button
                  onClick={() => deleteVehicle(vehicle.vehicleId)}
                  title="Excluir"
                >
                  <Trash />
                </button>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell className="text-right" colSpan={8}>
            Total de registros: {vehicles.length}
          </TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
}
