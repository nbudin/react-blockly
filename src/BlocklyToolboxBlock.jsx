/* eslint-disable react/no-array-index-key */

import React from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';

class BlocklyToolboxBlock extends React.PureComponent {
  static propTypes = {
    type: PropTypes.string.isRequired,
    shadow: PropTypes.bool,
    fields: ImmutablePropTypes.map,
    values: ImmutablePropTypes.map,
    statements: ImmutablePropTypes.map,
    next: ImmutablePropTypes.map,
    mutation: ImmutablePropTypes.mapContains({
      attributes: ImmutablePropTypes.map,
      innerContent: PropTypes.string,
    }),
  };

  static defaultProps = {
    shadow: false,
    fields: null,
    values: null,
    statements: null,
    next: null,
    mutation: null,
  };

  static renderBlock = (block, key) => (
    <BlocklyToolboxBlock
      type={block.get('type')}
      key={key}
      fields={block.get('fields')}
      values={block.get('values')}
      statements={block.get('statements')}
      mutation={block.get('mutation')}
      shadow={block.get('shadow')}
      next={block.get('next')}
    />
  );

  componentDidMount = () => {
    if (this.props.mutation) {
      this.props.mutation.get('attributes').forEach((value, attributeName) => {
        this.mutationElement.setAttribute(attributeName, value);
        return true;
      });
    }
  }

  render = () => {
    let fields = [];
    let values = [];
    let statements = [];
    let mutation = null;
    let nextBlock = null;

    if (this.props.fields) {
      fields = this.props.fields.map((fieldValue, fieldName, i) => (
        <field name={fieldName} key={`field_${fieldName}_${i}`}>
          {fieldValue}
        </field>
      )).valueSeq();
    }

    if (this.props.values) {
      values = this.props.values.map((valueBlock, valueName, i) => (
        <value name={valueName} key={`value_${valueName}_${i}`}>
          {BlocklyToolboxBlock.renderBlock(valueBlock)}
        </value>
      )).valueSeq();
    }

    if (this.props.statements) {
      statements = this.props.statements.map((statementBlock, statementName, i) => (
        <statement name={statementName} key={`statement_${statementName}_${i}`}>
          {BlocklyToolboxBlock.renderBlock(statementBlock)}
        </statement>
      )).valueSeq();
    }

    if (this.props.mutation) {
      mutation = ((
        <mutation
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: this.props.mutation.get('innerContent') }}
          ref={(mutationElement) => { this.mutationElement = mutationElement; }}
        />
      ));
    }

    if (this.props.next) {
      nextBlock = ((
        <next>
          {BlocklyToolboxBlock.renderBlock(this.props.next)}
        </next>
      ));
    }

    if (this.props.shadow) {
      return (
        <shadow type={this.props.type}>
          {mutation}
          {fields}
          {values}
          {statements}
          {nextBlock}
        </shadow>
      );
    }

    return (
      <block type={this.props.type}>
        {mutation}
        {fields}
        {values}
        {statements}
        {nextBlock}
      </block>
    );
  }
}

export default BlocklyToolboxBlock;
