"use client";
import { useState, useEffect } from "react";
import api from "@/lib/axios";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Trash2Icon } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn, secondsToHHMM } from "@/lib/utils";
import { useControliDUpdate } from "@/contexts/control-id-update-context";
import { useSession } from "next-auth/react";
import { deleteAction } from "@/lib/delete-action";
import { SkeletonTable } from "@/components/_skeletons/skeleton-table";
import { Check, X } from "@phosphor-icons/react/dist/ssr";
import TimeSpanUpdateForm from "./timeSpanUpdateForm";

export default function TimeSpanTable() {
  const { data: session } = useSession();
  const { update } = useControliDUpdate();
  const [timeSpans, setTimeSpans] = useState<TimeSpan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const fetchData = async () => {
    if (session) {
      try {
        const response = await api.get(`timeSpan`, {
          headers: {
            Authorization: `Bearer ${session.token.user.token}`,
          },
        });
        setTimeSpans(response.data);

        setIsLoading(false);
      } catch (error) {
        console.log(error);
      }
    }
  };
  useEffect(() => {
    fetchData();
  }, [session, update]);

  const deleteItem = async (id: number) => {
    deleteAction(session, "intervalo", `timeSpan/${id}`, fetchData);
  };

  return (
    <>
      {isLoading ? (
        <SkeletonTable />
      ) : (
        <div className="w-full max-h-[60vh] overflow-auto">
          <Table className="w-full border">
            <TableHeader>
              <TableRow className="bg-secondary hover:bg-secondary">
                <TableHead>ID</TableHead>
                <TableHead>Horário</TableHead>
                <TableHead>Início</TableHead>
                <TableHead>Fim</TableHead>
                <TableHead>Dias da semana</TableHead>
                <TableHead>Feriados</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {timeSpans && timeSpans.length > 0 ? (
                timeSpans.map((timeSpan) => (
                  <TableRow key={timeSpan.timeSpanId}>
                    <TableCell>{timeSpan.timeSpanId}</TableCell>
                    <TableCell>{timeSpan.timeZone.name}</TableCell>
                    <TableCell>{secondsToHHMM(timeSpan.start)}</TableCell>
                    <TableCell>{secondsToHHMM(timeSpan.end)}</TableCell>
                    <TableCell className="flex flex-col">
                      <div className="grid grid-cols-7">
                        <p>Dom</p>
                        <p>Seg</p>
                        <p>Ter</p>
                        <p>Qua</p>
                        <p>Qui</p>
                        <p>Sex</p>
                        <p>Sab</p>
                      </div>
                      <div className="grid grid-cols-7 text-xl">
                        {timeSpan.sun === 1 ? (
                          <Check className="text-green-500" />
                        ) : (
                          <X className="text-red-500" />
                        )}
                        {timeSpan.mon === 1 ? (
                          <Check className="text-green-500" />
                        ) : (
                          <X className="text-red-500" />
                        )}
                        {timeSpan.tue === 1 ? (
                          <Check className="text-green-500" />
                        ) : (
                          <X className="text-red-500" />
                        )}
                        {timeSpan.wed === 1 ? (
                          <Check className="text-green-500" />
                        ) : (
                          <X className="text-red-500" />
                        )}
                        {timeSpan.thu === 1 ? (
                          <Check className="text-green-500" />
                        ) : (
                          <X className="text-red-500" />
                        )}
                        {timeSpan.fri === 1 ? (
                          <Check className="text-green-500" />
                        ) : (
                          <X className="text-red-500" />
                        )}
                        {timeSpan.sat === 1 ? (
                          <Check className="text-green-500" />
                        ) : (
                          <X className="text-red-500" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <p>{timeSpan.hol1 === 1 && "Tipo 1"}</p>
                        <p>{timeSpan.hol2 === 1 && "Tipo 2"}</p>
                        <p>{timeSpan.hol3 === 1 && "Tipo 3"}</p>
                        <p>
                          {timeSpan.hol1 !== 1 &&
                            timeSpan.hol2 !== 1 &&
                            timeSpan.hol3 !== 1 &&
                            "Nenhum"}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button
                        onClick={() => deleteItem(timeSpan.timeSpanId)}
                        className="aspect-square p-0"
                        variant={"ghost"}
                      >
                        <Trash2Icon />
                      </Button>
                      <TimeSpanUpdateForm
                        id={timeSpan.timeSpanId}
                        time_zone_id={timeSpan.timeZoneId}
                        start_hour={secondsToHHMM(timeSpan.start).split(":")[0]}
                        start_min={secondsToHHMM(timeSpan.start).split(":")[1]}
                        end_hour={secondsToHHMM(timeSpan.end).split(":")[0]}
                        end_min={secondsToHHMM(timeSpan.end).split(":")[1]}
                        sun={timeSpan.sun === 1 ? true : false}
                        mon={timeSpan.mon === 1 ? true : false}
                        tue={timeSpan.tue === 1 ? true : false}
                        wed={timeSpan.wed === 1 ? true : false}
                        thu={timeSpan.thu === 1 ? true : false}
                        fri={timeSpan.fri === 1 ? true : false}
                        sat={timeSpan.sat === 1 ? true : false}
                        hol1={timeSpan.hol1 === 1 ? true : false}
                        hol2={timeSpan.hol2 === 1 ? true : false}
                        hol3={timeSpan.hol3 === 1 ? true : false}
                      />
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    rowSpan={2}
                    colSpan={10}
                    className="w-full text-center"
                  >
                    Nenhum dado encontrado.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </>
  );
}
