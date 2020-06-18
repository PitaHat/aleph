import React, { Component } from 'react';
import { defineMessages, injectIntl, FormattedMessage } from 'react-intl';
import { Button, ButtonGroup, ControlGroup, InputGroup } from '@blueprintjs/core';
import c from 'classnames';

import { Count } from 'src/components/common';
import EntityDeleteDialog from 'src/dialogs/EntityDeleteDialog/EntityDeleteDialog';


import './EntityActionBar.scss';


export default class EntityActionBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      queryText: '',
      deleteIsOpen: false,
    };

    this.toggleDeleteSelection = this.toggleDeleteSelection.bind(this);
    this.onQueryTextChange = this.onQueryTextChange.bind(this);
    this.onSearchSubmit = this.onSearchSubmit.bind(this);
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const nextQueryText = nextProps.query ? nextProps.query.getString('q') : prevState.queryText;
    const queryChanged = !prevState?.prevQuery || prevState.prevQuery.getString('q') !== nextQueryText;
    return {
      prevQuery: nextProps.query,
      queryText: queryChanged ? nextQueryText : prevState.queryText,
    };
  }

  toggleDeleteSelection() {
    const { resetSelection } = this.props;
    const { deleteIsOpen } = this.state;
    if (deleteIsOpen) {
      resetSelection();
    }
    this.setState(({ deleteIsOpen: !deleteIsOpen }));
  }

  onQueryTextChange({ target }) {
    const queryText = target.value;
    this.setState({ queryText });
  }

  onSearchSubmit(e) {
    e.preventDefault();
    const { queryText } = this.state;
    this.props.onSearchSubmit(queryText);
  }

  render() {
    const { children, searchPlaceholder, selection, writeable } = this.props;
    const { queryText } = this.state;

    return (
      <>
        <ControlGroup className="EntityActionBar">
          {writeable && (
            <ButtonGroup>
              {children}
              <Button icon="trash" onClick={this.toggleDeleteSelection} disabled={!selection.length}>
                <span className="align-middle">
                  <FormattedMessage id="entity.viewer.delete" defaultMessage="Delete" />
                </span>
                <Count count={selection.length} />
              </Button>
            </ButtonGroup>
          )}
          <form onSubmit={this.onSearchSubmit}>
            <InputGroup
              fill
              leftIcon="search"
              onChange={this.onQueryTextChange}
              placeholder={searchPlaceholder}
              value={queryText}
            />
          </form>
        </ControlGroup>
        {writeable && selection && (
          <EntityDeleteDialog
            entities={selection}
            isOpen={this.state.deleteIsOpen}
            toggleDialog={this.toggleDeleteSelection}
          />
        )}
      </>
    );
  }
}
