import React from 'react';
import ReactDOM from 'react-dom';
import ImmutablePropTypes from 'react-immutable-proptypes';
import ImmutableRenderMixin from 'react-immutable-render-mixin';

var BlocklyToolboxBlock = React.createClass({
  mixins: [ImmutableRenderMixin],

  propTypes: {
    type: React.PropTypes.string.isRequired,
    shadow: React.PropTypes.bool,
    fields: ImmutablePropTypes.map,
    values: ImmutablePropTypes.map,
    statements: ImmutablePropTypes.map,
    next: ImmutablePropTypes.map,
    mutation: ImmutablePropTypes.mapContains({
      attributes: ImmutablePropTypes.map,
      innerContent: React.PropTypes.string
    })
  },

  statics: {
    renderBlock: function(block, key) {
      return (
        <BlocklyToolboxBlock
          type={block.get('type')}
          key={key}
          fields={block.get('fields')}
          values={block.get('values')}
          statements={block.get('statements')}
          mutation={block.get('mutation')}
          shadow={block.get('shadow')}
          next={block.get('next')} />
      );
    }
  },

  componentDidMount: function() {
    if (this.props.mutation) {
      var mutation = ReactDOM.findDOMNode(this.refs.mutation);

      this.props.mutation.get('attributes').forEach(function(value, attributeName) {
        mutation.setAttribute(attributeName, value);
        return true;
      });
    }
  },

  render: function() {
    var fields = [];
    var values = [];
    var statements = [];
    var mutation = null;
    var nextBlock = null;

    if (this.props.fields) {
      fields = this.props.fields.map(function(fieldValue, fieldName, i) {
        return (
          <field name={fieldName} key={"field_" + fieldName + "_" + i}>
            {fieldValue}
          </field>
        );
      }.bind(this)).valueSeq();
    }

    if (this.props.values) {
      values = this.props.values.map(function(valueBlock, valueName, i) {
        return (
          <value name={valueName} key={"value_" + valueName + "_" + i}>
            {BlocklyToolboxBlock.renderBlock(valueBlock)}
          </value>
        );
      }.bind(this)).valueSeq();

    }

    if (this.props.statements) {
      statements = this.props.statements.map(function(statementBlock, statementName, i) {
        return (
          <statement name={statementName} key={"statement_" + statementName + "_" + i}>
            {BlocklyToolboxBlock.renderBlock(statementBlock)}
          </statement>
        );
      }.bind(this)).valueSeq();
    }

    if (this.props.mutation) {
      mutation = <mutation dangerouslySetInnerHTML={{__html: this.props.mutation.get('innerContent')}} ref="mutation" />;
    }

    if (this.props.next) {
      nextBlock = <next>
        {BlocklyToolboxBlock.renderBlock(this.props.next)}
      </next>;
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
    } else {
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
});

export default BlocklyToolboxBlock;