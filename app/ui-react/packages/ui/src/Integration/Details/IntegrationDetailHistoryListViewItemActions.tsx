import { DropdownKebab } from 'patternfly-react';
import * as React from 'react';
import { Link } from 'react-router-dom';
import { IMenuActions } from '../../Shared';
import { toTestId } from '../../utils';

export interface IIntegrationDetailHistoryListViewItemActionsProps {
  actions: IMenuActions[];
  integrationId: string;
}

export class IntegrationDetailHistoryListViewItemActions extends React.Component<
  IIntegrationDetailHistoryListViewItemActionsProps
> {
  public render() {
    return (
      <DropdownKebab
        id={`integration-${this.props.integrationId}-action-menu`}
        pullRight={true}
      >
        {this.props.actions.map((a, index) => {
          return (
            <li role={'presentation'} key={index}>
              {a.href ? (
                <Link
                  data-testid={`${toTestId(
                    'IntegrationDetailHistoryListViewItemActions',
                    a.label.toString()
                  )}`}
                  to={a.href}
                  onClick={a.onClick}
                  role={'menuitem'}
                  tabIndex={index + 1}
                >
                  {a.label}
                </Link>
              ) : (
                <a
                  data-testid={`${toTestId(
                    'IntegrationDetailHistoryListViewItemActions',
                    a.label.toString()
                  )}`}
                  href={'javascript:void(0)'}
                  onClick={a.onClick}
                  role={'menuitem'}
                  tabIndex={index + 1}
                >
                  {a.label}
                </a>
              )}
            </li>
          );
        })}
      </DropdownKebab>
    );
  }
}
