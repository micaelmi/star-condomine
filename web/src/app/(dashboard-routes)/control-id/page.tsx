import { Menu } from "@/components/menu";
import { ArrowsClockwise, Gear } from "@phosphor-icons/react/dist/ssr";
import { ControliDUpdateProvider } from "@/contexts/control-id-update-context";
import TimeSpanForm from "@/components/control-id/time-span/timeSpanForm";
import TimeSpanTable from "@/components/control-id/time-span/timeSpanTable";
import TimeZoneForm from "@/components/control-id/time-zone/timeZoneForm";
import TimeZoneTable from "@/components/control-id/time-zone/timeZoneTable";
import AccessRuleForm from "@/components/control-id/access-rule/accessRuleForm";
import AccessRuleTable from "@/components/control-id/access-rule/accessRuleTable";
import GroupForm from "@/components/control-id/group/groupForm";
import GroupTable from "@/components/control-id/group/groupTable";
import GroupAccessRuleForm from "@/components/control-id/group-access-rule/groupAccessRuleForm";
import GroupAccessRuleTable from "@/components/control-id/group-access-rule/groupAccessRuleTable";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SyncDevice from "@/components/control-id/device/syncDevice";
import AreaAccessRuleTable from "@/components/control-id/area-access-rule/areaAccessRuleTable";
import AccessRuleTimeZoneTable from "@/components/control-id/access-rule-time-zone/accessRuleTimeZoneTable";
import AreaAccessRuleForm from "@/components/control-id/area-access-rule/areaAccessRuleForm";
import AccessRuleTimeZoneForm from "@/components/control-id/access-rule-time-zone/accessRuleTimeZoneForm";

export default async function ControliD() {
  return (
    <ControliDUpdateProvider>
      <Menu />
      <section className="max-w-5xl mx-auto mb-6">
        <h1 className="flex gap-2 items-center text-4xl pb-4">
          <Gear /> Configurações Control iD
        </h1>
        <div className="flex gap-4">
          <SyncDevice />
          <Link
            href={"control-id/device"}
            className={buttonVariants({ variant: "default" })}
          >
            Testes em dispositivos
          </Link>
          <Link
            href={"control-id/accessRule"}
            className={buttonVariants({ variant: "default" })}
          >
            Definir regra de acesso
          </Link>
        </div>
        <div className="w-full flex justify-between items-end pb-2">
          <h2 className="text-xl">Horários</h2>
          <TimeZoneForm />
        </div>
        <TimeZoneTable />
        <div className="w-full flex justify-between items-end mt-4 pb-2">
          <h2 className="text-xl">Intervalos</h2>
          <TimeSpanForm />
        </div>
        <TimeSpanTable />
        <div className="w-full flex justify-between items-end mt-4 pb-2">
          <h2 className="text-xl">Regras de acesso</h2>
          <AccessRuleForm />
        </div>
        <AccessRuleTable />
        <div className="w-full flex justify-between items-end mt-4 pb-2">
          <h2 className="text-xl">Grupos</h2>
          <GroupForm />
        </div>
        <GroupTable />
        <div className="w-full flex justify-between items-end mt-4 pb-2">
          <h2 className="text-xl">Grupos x Regras de acesso</h2>
          <GroupAccessRuleForm />
        </div>
        <GroupAccessRuleTable />
        <div className="w-full flex justify-between items-end mt-4 pb-2">
          <h2 className="text-xl">Portarias x Regras de acesso</h2>
          <AreaAccessRuleForm />
        </div>
        <AreaAccessRuleTable />
        <div className="w-full flex justify-between items-end mt-4 pb-2">
          <h2 className="text-xl">Regras de acesso x Horários</h2>
          <AccessRuleTimeZoneForm />
        </div>
        <AccessRuleTimeZoneTable />
      </section>
      <ToastContainer position="bottom-right" autoClose={2500} />
    </ControliDUpdateProvider>
  );
}
