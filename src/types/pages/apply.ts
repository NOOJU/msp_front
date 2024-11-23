export type inboundRulePlusProps = {
  name: string;
  list: inboundRuleList[];
  onChanger: (list: inboundRuleList[]) => void;
};

export type inboundRuleList = {
  inPort: string;
  inTcp: string;
  inOrigin: string;
};

export type outboundRulePlusProps = {
  name: string;
  list: outboundRuleList[];
  onChanger: (list: outboundRuleList[]) => void;
};

export type outboundRuleList = {
  outPort: string;
  outTcp: string;
  outOrigin: string;
};

export type applyErrors = {
  usage: string;
  applyReason: string;
  vmName: string;
  vmImage: string;
  vmSpec: string;
  vmVolume: string;
  inboundRule: string;
  outboundRule: string;
  additionalRequest: string;
  csp: string;
};
