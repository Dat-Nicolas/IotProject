import React, { useState } from 'react';
import {
  Alert,
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import {
  useGetBrandsQuery,
  useCreateBrandMutation,
  useUpdateBrandMutation,
  useDeleteBrandMutation,
  BrandResponse,
} from '../../redux/api/brandApi';

// ─── Form Modal ───────────────────────────────────────────────────────────────

type FormState = { name: string; irProtocol: string };
const EMPTY: FormState = { name: '', irProtocol: '' };

interface BrandFormModalProps {
  visible: boolean;
  initial?: Partial<FormState>;
  isEdit: boolean;
  loading: boolean;
  onClose: () => void;
  onSubmit: (form: FormState) => void;
  colors: ReturnType<typeof useTheme>['colors'];
}

function BrandFormModal({ visible, initial, isEdit, loading, onClose, onSubmit, colors }: BrandFormModalProps) {
  const [form, setForm] = useState<FormState>({ ...EMPTY, ...initial });
  const patch = (k: keyof FormState) => (v: string) => setForm((f) => ({ ...f, [k]: v }));

  React.useEffect(() => {
    setForm({ ...EMPTY, ...initial });
  }, [initial, visible]);

  const inputStyle = [styles.input, { backgroundColor: colors.background, borderColor: colors.border, color: colors.text }];

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={[styles.sheet, { backgroundColor: colors.card }]}>
          <Text style={[styles.sheetTitle, { color: colors.text }]}>
            {isEdit ? '✏️ Sửa thương hiệu' : '➕ Thêm thương hiệu'}
          </Text>

          <Text style={[styles.label, { color: colors.mutedText }]}>Tên thương hiệu *</Text>
          <TextInput style={inputStyle} value={form.name} onChangeText={patch('name')} placeholder="VD: Daikin" placeholderTextColor={colors.mutedText} />

          <Text style={[styles.label, { color: colors.mutedText }]}>Giao thức IR</Text>
          <TextInput style={inputStyle} value={form.irProtocol} onChangeText={patch('irProtocol')} placeholder="VD: NEC, DAIKIN..." placeholderTextColor={colors.mutedText} />

          <View style={styles.actions}>
            <Pressable onPress={onClose} style={[styles.btnCancel, { borderColor: colors.border }]}>
              <Text style={{ color: colors.mutedText, fontWeight: '600' }}>Huỷ</Text>
            </Pressable>
            <Pressable onPress={() => onSubmit(form)} disabled={loading}
              style={[styles.btnSave, { backgroundColor: colors.primary }]}>
              <Text style={{ color: '#fff', fontWeight: '700' }}>{loading ? 'Đang lưu...' : 'Lưu'}</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

// ─── Screen ──────────────────────────────────────────────────────────────────

const PROTOCOL_COLORS: Record<string, string> = {
  NEC: '#3B82F6',
  DAIKIN: '#10B981',
  SAMSUNG: '#8B5CF6',
  LG: '#F59E0B',
  MITSUBISHI: '#EF4444',
};

export default function BrandsManagementScreen() {
  const { colors } = useTheme();
  const { data: brands = [], isLoading, refetch } = useGetBrandsQuery();
  const [createBrand, { isLoading: creating }] = useCreateBrandMutation();
  const [updateBrand, { isLoading: updating }] = useUpdateBrandMutation();
  const [deleteBrand] = useDeleteBrandMutation();

  const [showModal, setShowModal] = useState(false);
  const [editTarget, setEditTarget] = useState<BrandResponse | null>(null);

  const openCreate = () => { setEditTarget(null); setShowModal(true); };
  const openEdit = (b: BrandResponse) => { setEditTarget(b); setShowModal(true); };
  const closeModal = () => setShowModal(false);

  const handleSubmit = async (form: FormState) => {
    const payload = { name: form.name.trim(), irProtocol: form.irProtocol.trim() || undefined };
    try {
      if (editTarget) {
        await updateBrand({ id: editTarget.id, data: payload }).unwrap();
        Alert.alert('✅ Thành công', 'Cập nhật thương hiệu thành công');
      } else {
        await createBrand(payload).unwrap();
        Alert.alert('✅ Thành công', 'Thêm thương hiệu thành công');
      }
      closeModal();
    } catch {
      Alert.alert('❌ Lỗi', 'Không thể lưu thương hiệu');
    }
  };

  const handleDelete = (b: BrandResponse) => {
    Alert.alert('Xoá thương hiệu', `Bạn có chắc muốn xoá "${b.name}"?`, [
      { text: 'Huỷ', style: 'cancel' },
      {
        text: 'Xoá', style: 'destructive',
        onPress: async () => {
          try { await deleteBrand(b.id).unwrap(); }
          catch { Alert.alert('❌ Lỗi', 'Không thể xoá thương hiệu'); }
        },
      },
    ]);
  };

  const renderItem = ({ item }: { item: BrandResponse }) => {
    const protoKey = item.irProtocol?.toUpperCase() ?? '';
    const accentColor = PROTOCOL_COLORS[protoKey] ?? colors.primary;

    return (
      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={[styles.brandIcon, { backgroundColor: accentColor + '20' }]}>
          <Text style={{ fontSize: 22 }}>📡</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[styles.brandName, { color: colors.text }]}>{item.name}</Text>
          {item.irProtocol ? (
            <View style={[styles.protoBadge, { backgroundColor: accentColor + '20' }]}>
              <Text style={{ fontSize: 11, fontWeight: '700', color: accentColor }}>{item.irProtocol}</Text>
            </View>
          ) : (
            <Text style={[styles.noProto, { color: colors.mutedText }]}>Chưa có giao thức</Text>
          )}
        </View>
        <View style={styles.cardActions}>
          <Pressable onPress={() => openEdit(item)} style={[styles.iconBtn, { backgroundColor: colors.primaryLight }]}>
            <Text style={{ fontSize: 18 }}>✏️</Text>
          </Pressable>
          <Pressable onPress={() => handleDelete(item)} style={[styles.iconBtn, { backgroundColor: '#FEE2E2' }]}>
            <Text style={{ fontSize: 18 }}>🗑️</Text>
          </Pressable>
        </View>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.headerBar, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>📡 Quản lý thương hiệu</Text>
        <Pressable onPress={openCreate} style={[styles.addBtn, { backgroundColor: colors.primary }]}>
          <Text style={{ color: '#fff', fontWeight: '700', fontSize: 22, lineHeight: 26 }}>+</Text>
        </Pressable>
      </View>

      <FlatList
        data={brands}
        keyExtractor={(b) => b.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        onRefresh={refetch}
        refreshing={isLoading}
        ListEmptyComponent={<Text style={[styles.empty, { color: colors.mutedText }]}>Chưa có thương hiệu nào</Text>}
      />

      <BrandFormModal
        visible={showModal}
        initial={editTarget ? { name: editTarget.name, irProtocol: editTarget.irProtocol ?? '' } : undefined}
        isEdit={!!editTarget}
        loading={creating || updating}
        onClose={closeModal}
        onSubmit={handleSubmit}
        colors={colors}
      />
    </View>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerBar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 1,
  },
  headerTitle: { fontSize: 18, fontWeight: '700' },
  addBtn: { width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center' },
  list: { padding: 16, gap: 12 },
  card: {
    borderRadius: 14, borderWidth: 1, padding: 14,
    flexDirection: 'row', alignItems: 'center', gap: 12,
  },
  brandIcon: { width: 48, height: 48, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  brandName: { fontSize: 15, fontWeight: '700', marginBottom: 4 },
  protoBadge: { alignSelf: 'flex-start', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 2 },
  noProto: { fontSize: 12 },
  cardActions: { flexDirection: 'row', gap: 8 },
  iconBtn: { width: 38, height: 38, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  empty: { textAlign: 'center', marginTop: 60, fontSize: 15 },
  // Modal
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  sheet: { borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24 },
  sheetTitle: { fontSize: 18, fontWeight: '700', marginBottom: 16 },
  label: { fontSize: 13, fontWeight: '500', marginBottom: 4, marginTop: 10 },
  input: { borderWidth: 1, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 11, fontSize: 15 },
  actions: { flexDirection: 'row', gap: 12, marginTop: 20 },
  btnCancel: { flex: 1, alignItems: 'center', paddingVertical: 13, borderRadius: 12, borderWidth: 1 },
  btnSave: { flex: 1, alignItems: 'center', paddingVertical: 13, borderRadius: 12 },
});
