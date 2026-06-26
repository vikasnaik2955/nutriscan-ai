import { useRef, useState } from 'react';
import { Dimensions, FlatList, StyleSheet, View, type ViewToken } from 'react-native';
import { useRouter } from 'expo-router';
import { ScanLine, HeartPulse, History } from 'lucide-react-native';
import { Button, Screen, Text } from '@/components/ui';
import { theme } from '@/theme';

const { width } = Dimensions.get('window');

interface Slide {
  icon: React.ReactNode;
  title: string;
  body: string;
}

const SLIDES: Slide[] = [
  {
    icon: <ScanLine size={64} color={theme.colors.brand} strokeWidth={1.75} />,
    title: 'Scan any packet',
    body: 'Point your camera at a barcode or nutrition label. NutriScan reads it instantly.',
  },
  {
    icon: <HeartPulse size={64} color={theme.colors.food} strokeWidth={1.75} />,
    title: 'Know your health score',
    body: 'Get a clear 0–10 score with plain-language reasons — is this good for you or not?',
  },
  {
    icon: <History size={64} color={theme.colors.info} strokeWidth={1.75} />,
    title: 'Track and improve',
    body: 'Keep a history of every scan and watch your choices get healthier over time.',
  },
];

export default function Onboarding() {
  const router = useRouter();
  const listRef = useRef<FlatList<Slide>>(null);
  const [index, setIndex] = useState(0);
  const isLast = index === SLIDES.length - 1;

  const onViewable = useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    if (viewableItems[0]?.index != null) setIndex(viewableItems[0].index);
  }).current;

  const next = () => {
    if (isLast) router.replace('/(auth)/login');
    else listRef.current?.scrollToIndex({ index: index + 1 });
  };

  return (
    <Screen scroll={false} padded={false}>
      <View style={styles.skipRow}>
        <Text variant="sm" weight="semibold" color={theme.colors.textMuted} onPress={() => router.replace('/(auth)/login')}>
          Skip
        </Text>
      </View>

      <FlatList
        ref={listRef}
        data={SLIDES}
        keyExtractor={(_, i) => String(i)}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewable}
        viewabilityConfig={{ viewAreaCoveragePercentThreshold: 60 }}
        renderItem={({ item }) => (
          <View style={[styles.slide, { width }]}>
            <View style={styles.iconWrap}>{item.icon}</View>
            <Text variant="h1" center style={styles.title}>{item.title}</Text>
            <Text variant="lg" center color={theme.colors.textSecondary}>{item.body}</Text>
          </View>
        )}
      />

      <View style={styles.footer}>
        <View style={styles.dots}>
          {SLIDES.map((_, i) => (
            <View
              key={i}
              style={[styles.dot, { backgroundColor: i === index ? theme.colors.brand : theme.colors.borderStrong, width: i === index ? 24 : 8 }]}
            />
          ))}
        </View>
        <Button label={isLast ? 'Get started' : 'Next'} onPress={next} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  skipRow: { alignItems: 'flex-end', paddingHorizontal: theme.layout.contentPad, paddingTop: theme.spacing[2] },
  slide: { alignItems: 'center', justifyContent: 'center', paddingHorizontal: theme.spacing[8], gap: theme.spacing[5] },
  iconWrap: {
    width: 132, height: 132, borderRadius: theme.radius.full,
    backgroundColor: theme.colors.brandSoft, alignItems: 'center', justifyContent: 'center',
    marginBottom: theme.spacing[4],
  },
  title: { marginBottom: theme.spacing[1] },
  footer: { paddingHorizontal: theme.layout.contentPad, paddingBottom: theme.spacing[6], gap: theme.spacing[5] },
  dots: { flexDirection: 'row', justifyContent: 'center', gap: theme.spacing[2] },
  dot: { height: 8, borderRadius: theme.radius.full },
});
