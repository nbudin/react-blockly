import React from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';

import BlocklyToolboxBlock from './BlocklyToolboxBlock';

class BlocklyToolboxCategory extends React.PureComponent {
  static propTypes = {
    name: PropTypes.string,
    custom: PropTypes.string,
    colour: PropTypes.string,
    categories: ImmutablePropTypes.list,
    blocks: ImmutablePropTypes.list,
  };

  static defaultProps = {
    name: null,
    custom: null,
    colour: null,
    categories: null,
    blocks: null,
  };

  static renderCategory = (category, key) => {
    if (category.get('type') === 'sep') {
      return <sep key={key} />;
    } else if (category.get('type') === 'search') {
      return <search key={key} />;
    }
    return (<BlocklyToolboxCategory
      name={category.get('name')}
      custom={category.get('custom')}
      colour={category.get('colour')}
      key={key}
      blocks={category.get('blocks')}
      categories={category.get('categories')}
    />);
  };

  render = () => {
    const subcategories = (this.props.categories || []).map(BlocklyToolboxCategory.renderCategory);
    const blocks = (this.props.blocks || []).map(BlocklyToolboxBlock.renderBlock);

    return (
      <category name={this.props.name} custom={this.props.custom} colour={this.props.colour}>
        {blocks}
        {subcategories}
      </category>
    );
  }
}

export default BlocklyToolboxCategory;
