import React from 'react';
import ReactDOM from 'react-dom';

var BlocklyToolboxBlock = React.createClass({
  propTypes: {
    type: React.PropTypes.string.isRequired,
    shadow: React.PropTypes.bool,
    fields: React.PropTypes.object,
    values: React.PropTypes.object,
    statements: React.PropTypes.object,
    next: React.PropTypes.object,
    mutation: React.PropTypes.shape({
      attributes: React.PropTypes.object,
      innerContent: React.PropTypes.string
    })
  },

  componentDidMount: function() {
    if (this.props.mutation) {
      var mutation = ReactDOM.findDOMNode(this.refs.mutation);

      Object.getOwnPropertyNames(this.props.mutation.attributes).forEach(function(attributeName) {
        mutation.setAttribute(attributeName, this.props.mutation.attributes[attributeName]);
      }.bind(this));
    }
  },

  render: function() {
    var fields = [];
    var values = [];
    var mutation = null;
    var nextBlock = null;

    if (this.props.fields) {
      fields = Object.getOwnPropertyNames(this.props.fields).map(function(fieldName, i) {
        return (
          <field name={fieldName} key={"field_" + fieldName + "_" + i}>
            { this.props.fields[fieldName] }
          </field>
        );
      }.bind(this));
    }

    if (this.props.values) {
      values = Object.getOwnPropertyNames(this.props.values).map(function(valueName, i) {
        var valueBlock = this.props.values[valueName];

        return (
          <value name={valueName} key={"value_" + valueName + "_" + i}>
            <BlocklyToolboxBlock
              name={valueName}
              type={valueBlock.type}
              fields={valueBlock.fields}
              values={valueBlock.values}
              mutation={valueBlock.mutation}
              shadow={valueBlock.shadow}
              next={valueBlock.next}
              />
          </value>
        );
      }.bind(this));
    }

    if (this.props.mutation) {
      mutation = <mutation dangerouslySetInnerHTML={{__html: this.props.mutation.innerContent}} ref="mutation" />;
    }

    if (this.props.next) {
      nextBlock = <next>
        <BlocklyToolboxBlock
          type={this.props.next.type}
          fields={this.props.next.fields}
          values={this.props.next.values}
          mutation={this.props.next.mutation}
          shadow={this.props.next.shadow}
          next={this.props.next.next}
          />
      </next>;
    }

    if (this.props.shadow) {
      return (
        <shadow type={this.props.type}>
          {mutation}
          {fields}
          {values}
          {nextBlock}
        </shadow>
      );
    } else {
      return (
        <block type={this.props.type}>
          {mutation}
          {fields}
          {values}
          {nextBlock}
        </block>
      );
    }
  }
});

export default BlocklyToolboxBlock;