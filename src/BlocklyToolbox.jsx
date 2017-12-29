import React from 'react';
import PropTypes from 'prop-types';
import { is } from 'immutable';
import ImmutablePropTypes from 'react-immutable-proptypes';

import BlocklyToolboxCategory from './BlocklyToolboxCategory';
import BlocklyToolboxBlock from './BlocklyToolboxBlock';

class BlocklyToolbox extends React.Component {
  static propTypes = {
    categories: ImmutablePropTypes.list,
    blocks: ImmutablePropTypes.list,
    processCategory: PropTypes.func,
    didUpdate: PropTypes.func,
  };

  renderCategories = categories => categories.map((category, i) => {
    if (category.get('type') === 'sep') {
      return <sep key={`sep_${i}`} />;
    } else if (category.get('type') === 'search') {
      return <search key={`search_${i}`} />;
    }
    return (<BlocklyToolboxCategory
      name={category.get('name')}
      custom={category.get('custom')}
      colour={category.get('colour')}
      key={`category_${category.get('name')}_${i}`}
      blocks={category.get('blocks')}
      categories={category.get('categories')}
    />);
  })

  shouldComponentUpdate = (nextProps, nextState) => !(is(nextProps.categories, this.props.categories) && is(nextProps.blocks, this.props.blocks))

  componentDidMount = () => {
    this.props.didUpdate();
  }

  componentDidUpdate = (prevProps, prevState) => {
    this.props.didUpdate();
  }

  processCategory = (category) => {
    let processedCategory = category;

    if (processedCategory.has('categories')) {
      processedCategory = category.update('categories', subcategories => subcategories.map(this.processCategory));
    }

    if (this.props.processCategory) {
      return this.props.processCategory(processedCategory);
    }

    return processedCategory;
  }

  render = () => {
    if (this.props.categories) {
      return (
        <xml style={{ display: 'none' }}>
          {this.renderCategories(this.props.categories.map(this.processCategory))}
        </xml>
      );
    }
    return (
      <xml style={{ display: 'none' }}>
        {this.props.blocks.map(BlocklyToolboxBlock.renderBlock)}
      </xml>
    );
  }
}

export default BlocklyToolbox;
