import React from 'react';
import ReactGridLayout, { WidthProvider, Responsive } from 'react-grid-layout';
import cn from 'classnames';

import styles from './ConstructorGrid.module.scss';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

const ResponsiveReactGridLayout = WidthProvider(Responsive);

type TConstructorGridProps = {
  className?: string;
  onChange: (layout: ReactGridLayout.Layout[]) => void;
  cols?: { [P: string]: number };
  layout: ReactGridLayout.Layout[];
  onLayoutChange: (layout: ReactGridLayout.Layout[]) => void;
  onRemoveItem: (id: number) => void;
  renderItem: (id: string) => React.ReactNode;
  allowChange?: boolean;
};

const colsInRow = 3;
const largeColsCount = 12;
// Со среднего размера экрана количество колонок в 2 раза меньше, чем при широком размере экрана
const middleColsCount = largeColsCount / 2;
const mdDefaultMinW = largeColsCount / colsInRow;
const smDefaultMinW = middleColsCount / colsInRow;

// Компонент не поддерживает функциональный подход
class ConstructorGrid extends React.Component<TConstructorGridProps> {
  static defaultProps = {
    cols: {
      lg: largeColsCount,
      md: largeColsCount,
      sm: middleColsCount,
      xs: middleColsCount,
      xxs: middleColsCount,
    },
    layout: [],
  };

  render() {
    const { className, cols, onLayoutChange, layout, renderItem } = this.props;
    const addMinWidthMapper = this.addMinWidthMapperGetter(layout);
    const biggerOrEqualMdLayout = addMinWidthMapper(mdDefaultMinW);
    const smallerOrEqualSmLayout = addMinWidthMapper(smDefaultMinW);

    const items = layout.map((grid: ReactGridLayout.Layout) => (
      <div data-grid={grid.i} key={grid.i}>
        {renderItem(grid.i)}
      </div>
    ));

    const layouts = {
      lg: biggerOrEqualMdLayout,
      md: biggerOrEqualMdLayout,
      sm: smallerOrEqualSmLayout,
      xs: smallerOrEqualSmLayout,
      xxs: smallerOrEqualSmLayout,
    };

    return (
      <div className={cn(styles.container, className)}>
        <ResponsiveReactGridLayout
          layouts={layouts}
          className={styles.layout}
          cols={cols}
          onLayoutChange={onLayoutChange}
          margin={[12, 12]}
          isResizable
          rowHeight={474}
        >
          {items}
        </ResponsiveReactGridLayout>
      </div>
    );
  }

  private addMinWidthMapperGetter(grid: ReactGridLayout.Layout[]) {
    return (minW: number): ReactGridLayout.Layout[] => {
      return grid.map((gridItem) => ({
        ...gridItem,
        minW,
      }));
    };
  }
}

export default ConstructorGrid;
