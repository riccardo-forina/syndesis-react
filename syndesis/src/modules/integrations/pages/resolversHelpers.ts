import {
  Action,
  ConnectionOverview,
  Integration,
  Step,
} from '@syndesis/models';
import * as H from 'history';
import resolvers from '../resolvers';

export function getStartSelectActionHref(connection: ConnectionOverview) {
  return resolvers.create.start.selectAction({ connection });
}

export function getStartConfigureActionHref(
  connection: ConnectionOverview,
  action: Action
): H.LocationDescriptor {
  return resolvers.create.start.configureAction({
    actionId: action.id!,
    connection,
  });
}

export function getFinishSelectActionHref(
  startConnection: ConnectionOverview,
  startAction: Action,
  integration: Integration,
  connection: ConnectionOverview
): H.LocationDescriptor {
  return resolvers.create.finish.selectAction({
    finishConnection: connection,
    integration,
    startAction,
    startConnection,
  });
}

export function getFinishConfigureActionHref(
  startConnection: ConnectionOverview,
  startAction: Action,
  finishConnection: ConnectionOverview,
  integration: Integration,
  action: Action
): H.LocationDescriptor {
  return resolvers.create.finish.configureAction({
    actionId: action.id!,
    finishConnection,
    integration,
    startAction,
    startConnection,
  });
}

export function getCreateAddConnectionHref(
  integration: Integration,
  position: string
) {
  return resolvers.create.configure.addConnection.selectConnection({
    integration,
    position,
  });
}

export function getCreateAddStepHref(
  integration: Integration,
  position: string
) {
  return resolvers.create.configure.addStep.selectStep({
    integration,
    position,
  });
}

export function getCreateSelectActionHref(
  position: string,
  integration: Integration,
  connection: ConnectionOverview
) {
  return resolvers.create.configure.addConnection.selectAction({
    connection,
    integration,
    position,
  });
}

export function getCreateConfigureActionHref(
  position: string,
  integration: Integration,
  connection: ConnectionOverview,
  action: Action
): H.LocationDescriptor {
  return resolvers.create.configure.addConnection.configureAction({
    actionId: action.id!,
    connection,
    integration,
    position,
  });
}

export function getEditConfigureActionHref(
  position: string,
  integration: Integration,
  action: Action
): H.LocationDescriptor {
  return resolvers.create.configure.editConnection.configureAction({
    actionId: action.id!,
    integration,
    position,
  });
}

export function getConfigureConnectionHrefCallback(integration: Integration) {
  return (stepIdx: number, step: Step) =>
    resolvers.create.configure.editConnection.configureAction({
      actionId: step.action!.id!,
      integration,
      position: `${stepIdx}`,
    });
}

export function getConfigureStepHrefCallback(integration: Integration) {
  return (stepIdx: number, step: Step) => 'TODO';
}
