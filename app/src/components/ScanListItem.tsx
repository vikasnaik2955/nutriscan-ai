import { Pressable, StyleSheet, View } from 'react-native';
import { ChevronRight, Barcode, ScanText } from 'lucide-react-native';
import { Text } from '@/components/ui';
import { theme, bandColors } from '@/theme';
import type { ScanResult } from '@/types/health';

/** One row in the history list: score chip, name, meta, band accent. */
export function ScanListItem({ scan, onPress }: { scan: ScanResult; onPress: () => void }) {
  const { fg, soft } = bandColors(scan.healthBand);
  const Icon = scan.scanType === 'BARCODE' ? Barcode : ScanText;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.item, theme.shadow.sm, { borderLeftColor: fg }, pressed && styles.pressed]}
    >
      <View style={[styles.score, { backgroundColor: soft }]}>
        <Text variant="h3" weight="extra" color={fg}>{scan.healthScore}</Text>
      </View>

      <View style={styles.body}>
        <Text variant="lg" weight="semibold" numberOfLines={1}>{scan.productName ?? 'Unknown product'}</Text>
        <View style={styles.meta}>
          <Icon size={13} color={theme.colors.textMuted} />
          <Text variant="caption" color={theme.colors.textMuted}>
            {scan.scanType === 'BARCODE' ? 'Barcode' : 'Label'} · {timeAgo(scan.createdAt)}
          </Text>
        </View>
      </View>

      <ChevronRight size={20} color={theme.colors.textMuted} />
    </Pressable>
  );
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.round(diff / 60_000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.round(h / 24);
  return `${d}d ago`;
}

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing[3],
    backgroundColor: theme.colors.surfaceCard,
    borderRadius: theme.radius.lg,
    borderLeftWidth: 4,
    padding: theme.spacing[3],
  },
  pressed: { opacity: 0.7 },
  score: { width: 48, height: 48, borderRadius: theme.radius.md, alignItems: 'center', justifyContent: 'center' },
  body: { flex: 1, gap: 2 },
  meta: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing[1] },
});
