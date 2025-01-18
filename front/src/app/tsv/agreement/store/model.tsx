import {Agreement} from "../../../../api/ta/v1/tam_pb";

export type AgreementStore = {
    AgreementEdit: Agreement;
    Agreementlist: Agreement[];
    AgreementFilter: Agreement;
    AgreementtableUrl: string;
    AgreementText: string;
};
