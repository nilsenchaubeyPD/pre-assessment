import { StepFrame } from "../components/StepFrame";
import { Card } from "../components/Card";
import { ActionBar } from "../components/ActionBar";
import { Fi, FBtn } from "../components/fig";
import { S } from "../strings";
import { candidate, testConfig } from "../config/testConfig";
import { logout, next } from "../state/flowMachine";

export function Details() {
  return (
    <>
      <StepFrame title={testConfig.assessmentName} hideTitle>
        <Card>
          <div aria-hidden="true" className="f-h1" style={{ margin: 0 }}>{testConfig.assessmentName}</div>
          <div className="f-stk">
            <div className="f-stat">
              <span className="t"><Fi n="layers-three-02" /></span>
              <div><b>{testConfig.sections}</b><small>{S.details.totalSections}</small></div>
            </div>
            <div className="f-stat">
              <span className="t"><Fi n="clock" /></span>
              <div><b>{testConfig.durationMin}</b><small>{S.details.duration}</small></div>
            </div>
          </div>
        </Card>
        <Card>
          <h2>{S.details.confirmTitle}</h2>
          <div className="f-idbox">
            <div style={{ flex: 1, minWidth: 0 }}>
              <b>{candidate.name}</b>
              <small>{candidate.email}</small>
            </div>
            <FBtn variant="sec" onClick={logout}>{S.details.logout}</FBtn>
          </div>
        </Card>
      </StepFrame>
      <ActionBar primary={{ label: S.details.confirm, onClick: next }} />
    </>
  );
}
