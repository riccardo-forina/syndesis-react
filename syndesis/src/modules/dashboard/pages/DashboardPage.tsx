import {
  WithConnections,
  WithIntegrationsMetrics,
  WithMonitoredIntegrations,
} from '@syndesis/api';
import {
  Connection,
  IntegrationOverview,
  IntegrationWithMonitoring,
  IntegrationWithOverview,
} from '@syndesis/models';
import {
  AggregatedMetricCard,
  ConnectionsMetric,
  Dashboard,
  IntegrationBoard,
  IntegrationsList,
  IntegrationsListItem,
  IntegrationsListSkeleton,
  IntegrationStatus,
  RecentUpdatesCard,
  RecentUpdatesSkeleton,
  TopIntegrationsCard,
  UptimeMetric,
} from '@syndesis/ui';
import { WithLoader } from '@syndesis/utils';
import { Grid } from 'patternfly-react';
import * as React from 'react';
import { NamespacesConsumer } from 'react-i18next';
import { AppContext } from '../../../app';
import { Connections } from '../../connections/containers/Connections';

export interface IIntegrationCountsByState {
  Error: number;
  Pending: number;
  Published: number;
  Unpublished: number;
}

export function getIntegrationsCountsByState(
  integrations: IntegrationWithOverview[]
): IIntegrationCountsByState {
  return integrations.reduce(
    (counts, mi) => {
      const stateCount = counts[mi.integration.currentState!] || 0;
      return {
        ...counts,
        [mi.integration.currentState!]: stateCount + 1,
      };
    },
    {
      Error: 0,
      Pending: 0,
      Published: 0,
      Unpublished: 0,
    } as IIntegrationCountsByState
  );
}

export function getTimestamp(integration: IntegrationOverview) {
  return integration.updatedAt !== 0
    ? integration.updatedAt
    : integration.createdAt;
}

export function byTimestamp(a: IntegrationOverview, b: IntegrationOverview) {
  const aTimestamp = getTimestamp(a) || 0;
  const bTimestamp = getTimestamp(b) || 0;
  return bTimestamp - aTimestamp;
}

export function getRecentlyUpdatedIntegrations(
  integrations: IntegrationWithOverview[]
): IntegrationOverview[] {
  return integrations
    .map(mi => mi.integration)
    .sort(byTimestamp)
    .slice(0, 5);
}

export function getTopIntegrations(
  integrations: IntegrationWithOverview[],
  topIntegrations: { [name: string]: number } = {}
): IntegrationWithOverview[] {
  const topIntegrationsArray = Object.keys(topIntegrations)
    .map(key => {
      return {
        count: topIntegrations[key],
        id: key,
      } as any;
    })
    .sort((a, b) => {
      return b.count - a.count;
    });

  return integrations
    .sort((miA, miB) => byTimestamp(miA.integration, miB.integration))
    .sort((a, b) => {
      const index = topIntegrationsArray.findIndex(
        i => i.id === b.integration.id
      );
      return index === -1 ? topIntegrationsArray.length + 1 : index;
    })
    .reverse()
    .slice(0, 5);
}

export function getConnectionHref(connection: Connection) {
  return `/connections/${connection.id}`;
}

export default () => (
  <WithMonitoredIntegrations>
    {({ data: integrationsData, hasData: hasIntegrations }) => (
      <WithIntegrationsMetrics>
        {({ data: metricsData }) => (
          <WithConnections>
            {({ data: connectionsData, hasData: hasConnections }) => {
              const integrationStatesCount = getIntegrationsCountsByState(
                integrationsData.items
              );
              const recentlyUpdatedIntegrations = getRecentlyUpdatedIntegrations(
                integrationsData.items
              );
              const topIntegrations = getTopIntegrations(
                integrationsData.items,
                metricsData.topIntegrations
              );
              return (
                <AppContext.Consumer>
                  {({ config, getPodLogUrl }) => (
                    <NamespacesConsumer
                      ns={['dashboard', 'integrations', 'shared']}
                    >
                      {t => (
                        <Dashboard
                          linkToIntegrations={'/integrations'}
                          linkToIntegrationCreation={'/integration/create'}
                          linkToConnections={'/connections'}
                          linkToConnectionCreation={'/connection/create'}
                          integrationsOverview={
                            <AggregatedMetricCard
                              title={t('titleTotalIntegrations', {
                                count: integrationsData.totalCount,
                              })}
                              ok={
                                integrationsData.totalCount -
                                integrationStatesCount.Error
                              }
                              error={integrationStatesCount.Error}
                            />
                          }
                          connectionsOverview={
                            <ConnectionsMetric
                              count={connectionsData.totalCount}
                              i18nTitle={t('titleTotalConnections', {
                                count: connectionsData.totalCount,
                              })}
                            />
                          }
                          messagesOverview={
                            <AggregatedMetricCard
                              title={t('titleTotalMessages', {
                                count: metricsData.messages,
                              })}
                              ok={metricsData.messages! - metricsData.errors!}
                              error={metricsData.errors!}
                            />
                          }
                          uptimeOverview={
                            <UptimeMetric
                              start={parseInt(metricsData.start!, 10)}
                              i18nTitle={t('titleUptimeMetric')}
                            />
                          }
                          topIntegrations={
                            <TopIntegrationsCard
                              i18nTitle={t('titleTopIntegrations', {
                                count: 5,
                              })}
                              i18nLast30Days={t('lastNumberOfDays', {
                                numberOfDays: 30,
                              })}
                              i18nLast60Days={t('lastNumberOfDays', {
                                numberOfDays: 60,
                              })}
                              i18nLast90Days={t('lastNumberOfDays', {
                                numberOfDays: 90,
                              })}
                            >
                              <WithLoader
                                error={false}
                                loading={!hasIntegrations}
                                loaderChildren={
                                  <IntegrationsListSkeleton width={500} />
                                }
                                errorChildren={<div>TODO</div>}
                              >
                                {() => (
                                  <IntegrationsList>
                                    {topIntegrations.map(
                                      (
                                        mi: IntegrationWithMonitoring,
                                        index
                                      ) => (
                                        <IntegrationsListItem
                                          integrationId={mi.integration.id!}
                                          integrationName={mi.integration.name}
                                          currentState={
                                            mi.integration!.currentState!
                                          }
                                          targetState={
                                            mi.integration!.targetState!
                                          }
                                          isConfigurationRequired={
                                            !!(
                                              mi.integration!.board!.warnings ||
                                              mi.integration!.board!.errors ||
                                              mi.integration!.board!.notices
                                            )
                                          }
                                          monitoringValue={
                                            mi.monitoring &&
                                            t(
                                              'integrations:' +
                                                mi.monitoring.detailedState
                                                  .value
                                            )
                                          }
                                          monitoringCurrentStep={
                                            mi.monitoring &&
                                            mi.monitoring.detailedState
                                              .currentStep
                                          }
                                          monitoringTotalSteps={
                                            mi.monitoring &&
                                            mi.monitoring.detailedState
                                              .totalSteps
                                          }
                                          monitoringLogUrl={getPodLogUrl(
                                            config,
                                            mi.monitoring
                                          )}
                                          key={index}
                                          i18nConfigurationRequired={t(
                                            'integrations:ConfigurationRequired'
                                          )}
                                          i18nError={t('shared:Error')}
                                          i18nPublished={t('shared:Published')}
                                          i18nUnpublished={t(
                                            'shared:Unpublished'
                                          )}
                                          i18nProgressPending={t(
                                            'shared:Pending'
                                          )}
                                          i18nProgressStarting={t(
                                            'integrations:progressStarting'
                                          )}
                                          i18nProgressStopping={t(
                                            'integrations:progressStopping'
                                          )}
                                          i18nLogUrlText={t('shared:viewLogs')}
                                        />
                                      )
                                    )}
                                  </IntegrationsList>
                                )}
                              </WithLoader>
                            </TopIntegrationsCard>
                          }
                          integrationBoard={
                            <IntegrationBoard
                              runningIntegrations={
                                integrationStatesCount.Published
                              }
                              pendingIntegrations={
                                integrationStatesCount.Pending
                              }
                              stoppedIntegrations={
                                integrationStatesCount.Unpublished
                              }
                              i18nTitle={t('titleIntegrationBoard')}
                              i18nIntegrationStatePending={t(
                                'integrationStatePending'
                              )}
                              i18nIntegrationStateRunning={t(
                                'integrationStateRunning'
                              )}
                              i18nIntegrationStateStopped={t(
                                'integrationStateStopped'
                              )}
                              i18nIntegrations={t('shared:Integrations')}
                              i18nTotal={t('shared:Total')}
                            />
                          }
                          integrationUpdates={
                            <RecentUpdatesCard
                              i18nTitle={t('titleIntegrationUpdates')}
                            >
                              <WithLoader
                                error={false}
                                loading={!hasIntegrations}
                                loaderChildren={<RecentUpdatesSkeleton />}
                                errorChildren={<div>TODO</div>}
                              >
                                {() =>
                                  recentlyUpdatedIntegrations.map(i => (
                                    <Grid.Row key={i.id}>
                                      <Grid.Col sm={5}>{i.name}</Grid.Col>
                                      <Grid.Col sm={3}>
                                        <IntegrationStatus
                                          currentState={i.currentState}
                                          i18nError={t('shared:Error')}
                                          i18nPublished={t('shared:Published')}
                                          i18nUnpublished={t(
                                            'shared:Unpublished'
                                          )}
                                        />
                                      </Grid.Col>
                                      <Grid.Col sm={4}>
                                        {new Date(
                                          i.updatedAt! || i.createdAt!
                                        ).toLocaleString()}
                                      </Grid.Col>
                                    </Grid.Row>
                                  ))
                                }
                              </WithLoader>
                            </RecentUpdatesCard>
                          }
                          connections={
                            <Connections
                              error={false}
                              loading={!hasConnections}
                              connections={
                                connectionsData.connectionsForDisplay
                              }
                              getConnectionHref={getConnectionHref}
                            />
                          }
                          i18nConnections={t('shared:Connections')}
                          i18nLinkCreateConnection={t(
                            'shared:linkCreateConnection'
                          )}
                          i18nLinkCreateIntegration={t(
                            'shared:linkCreateIntegration'
                          )}
                          i18nLinkToConnections={t('linkToConnections')}
                          i18nLinkToIntegrations={t('linkToIntegrations')}
                          i18nTitle={t('title')}
                          i18nTitleIntegrationUpdates={t(
                            'titleIntegrationUpdates'
                          )}
                        />
                      )}
                    </NamespacesConsumer>
                  )}
                </AppContext.Consumer>
              );
            }}
          </WithConnections>
        )}
      </WithIntegrationsMetrics>
    )}
  </WithMonitoredIntegrations>
);
