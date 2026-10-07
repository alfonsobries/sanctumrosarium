import type { Step } from '@sanctamaria/rosary';
import { useCallback, useEffect, useRef } from 'react';
import { FlatList, View, useWindowDimensions, type ListRenderItemInfo } from 'react-native';

type StepPagerProperties = {
  steps: readonly Step[];
  position: number;
  /** The page that came to rest after a swipe. */
  onSettle: (index: number) => void;
  renderStep: (step: Step, active: boolean) => React.ReactNode;
};

/**
 * One page per prayer, like the leaves of a prayer book: a swipe snaps to the next one,
 * and when the voice or the beads move on, the pages turn to follow.
 */
export function StepPager({ steps, position, onSettle, renderStep }: StepPagerProperties) {
  const { width } = useWindowDimensions();
  const list = useRef<FlatList<Step>>(null);
  const shown = useRef(position);

  useEffect(() => {
    if (shown.current !== position) {
      shown.current = position;
      list.current?.scrollToIndex({ index: position, animated: true });
    }
  }, [position]);

  const renderItem = useCallback(
    ({ item, index }: ListRenderItemInfo<Step>) => (
      <View style={{ width }}>{renderStep(item, index === position)}</View>
    ),
    [width, renderStep, position],
  );

  return (
    <FlatList
      ref={list}
      data={steps as Step[]}
      keyExtractor={(step) => step.id}
      renderItem={renderItem}
      extraData={position}
      horizontal
      pagingEnabled
      decelerationRate="fast"
      showsHorizontalScrollIndicator={false}
      contentInsetAdjustmentBehavior="never"
      initialScrollIndex={position}
      getItemLayout={(_, index) => ({ length: width, offset: width * index, index })}
      windowSize={3}
      initialNumToRender={1}
      maxToRenderPerBatch={2}
      onMomentumScrollEnd={(event) => {
        const index = Math.round(event.nativeEvent.contentOffset.x / width);
        if (index !== shown.current) {
          shown.current = index;
          onSettle(index);
        }
      }}
    />
  );
}
