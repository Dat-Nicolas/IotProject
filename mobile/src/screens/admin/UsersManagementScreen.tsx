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
  useGetUsersQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  UserResponse,
  UserRole,
} from '../../redux/api/userApi';

// ─── Sub-components ──────────────────────────────────────────────────────────

type FormState = {
  fullName: string;
  email: string;
  password: string;
  role: UserRole;
};

const EMPTY_FORM: FormState = { fullName: '', email: '', password: '', role: 'USER' };

interface UserFormModalProps {
  visible: boolean;
  initial?: Partial<FormState>;
  isEdit: boolean;
  loading: boolean;
  onClose: () => void;
  onSubmit: (form: FormState) => void;
  colors: ReturnType<typeof useTheme>['colors'];
}

function UserFormModal({ visible, initial, isEdit, loading, onClose, onSubmit, colors }: UserFormModalProps) {
  const [form, setForm] = useState<FormState>({ ...EMPTY_FORM, ...initial });
  const patch = (key: keyof FormState) => (val: string) => setForm((f) => ({ ...f, [key]: val }));

  React.useEffect(() => {
    setForm({ ...EMPTY_FORM, ...initial });
  }, [initial, visible]);

  const inputStyle = [styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.text }];

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={[styles.modalCard, { backgroundColor: colors.card }]}>
          <Text style={[styles.modalTitle, { color: colors.text }]}>
            {isEdit ? '✏️ Sửa người dùng' : '➕ Thêm người dùng'}
          </Text>

          <Text style={[styles.label, { color: colors.mutedText }]}>Họ tên</Text>
          <TextInput style={inputStyle} value={form.fullName} onChangeText={patch('fullName')} placeholder="Nhập họ tên" placeholderTextColor={colors.mutedText} />

          <Text style={[styles.label, { color: colors.mutedText }]}>Email</Text>
          <TextInput style={inputStyle} value={form.email} onChangeText={patch('email')} placeholder="email@example.com" placeholderTextColor={colors.mutedText} autoCapitalize="none" keyboardType="email-address" />

          {!isEdit && (
            <>
              <Text style={[styles.label, { color: colors.mutedText }]}>Mật khẩu</Text>
              <TextInput style={inputStyle} value={form.password} onChangeText={patch('password')} placeholder="••••••••" placeholderTextColor={colors.mutedText} secureTextEntry />
            </>
          )}

          <Text style={[styles.label, { color: colors.mutedText }]}>Vai trò</Text>
          <View style={styles.roleRow}>
            {(['USER', 'ADMIN'] as UserRole[]).map((r) => (
              <Pressable
                key={r}
                onPress={() => patch('role')(r)}
                style={[
                  styles.roleChip,
                  { borderColor: colors.border, backgroundColor: form.role === r ? colors.primary : colors.card },
                ]}
              >
                <Text style={{ color: form.role === r ? '#fff' : colors.text, fontWeight: '600', fontSize: 13 }}>{r}</Text>
              </Pressable>
            ))}
          </View>

          <View style={styles.modalActions}>
            <Pressable onPress={onClose} style={[styles.btnCancel, { borderColor: colors.border }]}>
              <Text style={{ color: colors.mutedText, fontWeight: '600' }}>Huỷ</Text>
            </Pressable>
            <Pressable
              onPress={() => onSubmit(form)}
              disabled={loading}
              style={[styles.btnSave, { backgroundColor: colors.primary }]}
            >
              <Text style={{ color: '#fff', fontWeight: '700' }}>{loading ? 'Đang lưu...' : 'Lưu'}</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

// ─── Screen ──────────────────────────────────────────────────────────────────

export default function UsersManagementScreen() {
  const { colors } = useTheme();
  const { data: users = [], isLoading, refetch } = useGetUsersQuery();
  const [createUser, { isLoading: creating }] = useCreateUserMutation();
  const [updateUser, { isLoading: updating }] = useUpdateUserMutation();
  const [deleteUser] = useDeleteUserMutation();

  const [showModal, setShowModal] = useState(false);
  const [editTarget, setEditTarget] = useState<UserResponse | null>(null);

  const openCreate = () => { setEditTarget(null); setShowModal(true); };
  const openEdit = (u: UserResponse) => { setEditTarget(u); setShowModal(true); };
  const closeModal = () => setShowModal(false);

  const handleSubmit = async (form: FormState) => {
    try {
      if (editTarget) {
        await updateUser({
          id: editTarget.id,
          data: { fullName: form.fullName, email: form.email, role: form.role },
        }).unwrap();
        Alert.alert('✅ Thành công', 'Cập nhật người dùng thành công');
      } else {
        await createUser(form).unwrap();
        Alert.alert('✅ Thành công', 'Tạo người dùng thành công');
      }
      closeModal();
    } catch {
      Alert.alert('❌ Lỗi', 'Không thể lưu người dùng');
    }
  };

  const handleDelete = (u: UserResponse) => {
    Alert.alert('Xoá người dùng', `Bạn có chắc muốn xoá "${u.fullName}"?`, [
      { text: 'Huỷ', style: 'cancel' },
      {
        text: 'Xoá', style: 'destructive',
        onPress: async () => {
          try {
            await deleteUser(u.id).unwrap();
          } catch {
            Alert.alert('❌ Lỗi', 'Không thể xoá người dùng');
          }
        },
      },
    ]);
  };

  const renderItem = ({ item }: { item: UserResponse }) => (
    <View style={[styles.row, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={styles.rowInfo}>
        <View style={[styles.avatar, { backgroundColor: item.role === 'ADMIN' ? colors.primary : colors.secondary }]}>
          <Text style={styles.avatarText}>{item.fullName.charAt(0).toUpperCase()}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[styles.rowName, { color: colors.text }]} numberOfLines={1}>{item.fullName}</Text>
          <Text style={[styles.rowEmail, { color: colors.mutedText }]} numberOfLines={1}>{item.email}</Text>
          <View style={[styles.roleBadge, { backgroundColor: item.role === 'ADMIN' ? colors.primaryLight : colors.secondaryLight }]}>
            <Text style={{ fontSize: 11, fontWeight: '700', color: item.role === 'ADMIN' ? colors.primary : colors.secondary }}>
              {item.role}
            </Text>
          </View>
        </View>
      </View>
      <View style={styles.rowActions}>
        <Pressable onPress={() => openEdit(item)} style={[styles.actionBtn, { backgroundColor: colors.primaryLight }]}>
          <Text style={{ color: colors.primary, fontSize: 18 }}>✏️</Text>
        </Pressable>
        <Pressable onPress={() => handleDelete(item)} style={[styles.actionBtn, { backgroundColor: '#FEE2E2' }]}>
          <Text style={{ color: colors.danger, fontSize: 18 }}>🗑️</Text>
        </Pressable>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header bar */}
      <View style={[styles.headerBar, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>👥 Quản lý người dùng</Text>
        <Pressable onPress={openCreate} style={[styles.addBtn, { backgroundColor: colors.primary }]}>
          <Text style={{ color: '#fff', fontWeight: '700', fontSize: 22, lineHeight: 26 }}>+</Text>
        </Pressable>
      </View>

      <FlatList
        data={users}
        keyExtractor={(u) => u.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        onRefresh={refetch}
        refreshing={isLoading}
        ListEmptyComponent={
          <Text style={[styles.empty, { color: colors.mutedText }]}>Chưa có người dùng nào</Text>
        }
      />

      <UserFormModal
        visible={showModal}
        initial={editTarget ? { fullName: editTarget.fullName, email: editTarget.email, role: editTarget.role } : undefined}
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  headerTitle: { fontSize: 18, fontWeight: '700' },
  addBtn: {
    width: 38, height: 38, borderRadius: 19,
    alignItems: 'center', justifyContent: 'center',
  },
  list: { padding: 16, gap: 12 },
  row: {
    borderRadius: 14, borderWidth: 1,
    padding: 14,
    flexDirection: 'row', alignItems: 'center', gap: 12,
  },
  rowInfo: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: {
    width: 44, height: 44, borderRadius: 22,
    alignItems: 'center', justifyContent: 'center',
  },
  avatarText: { color: '#fff', fontWeight: '700', fontSize: 18 },
  rowName: { fontSize: 15, fontWeight: '600', marginBottom: 2 },
  rowEmail: { fontSize: 12, marginBottom: 4 },
  roleBadge: {
    alignSelf: 'flex-start', borderRadius: 6,
    paddingHorizontal: 8, paddingVertical: 2,
  },
  rowActions: { flexDirection: 'row', gap: 8 },
  actionBtn: { width: 38, height: 38, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  empty: { textAlign: 'center', marginTop: 60, fontSize: 15 },
  // Modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalCard: { borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24 },
  modalTitle: { fontSize: 18, fontWeight: '700', marginBottom: 16 },
  label: { fontSize: 13, fontWeight: '500', marginBottom: 4, marginTop: 10 },
  input: {
    borderWidth: 1, borderRadius: 10,
    paddingHorizontal: 14, paddingVertical: 11,
    fontSize: 15,
  },
  roleRow: { flexDirection: 'row', gap: 10, marginTop: 4 },
  roleChip: { flex: 1, alignItems: 'center', paddingVertical: 10, borderRadius: 10, borderWidth: 1 },
  modalActions: { flexDirection: 'row', gap: 12, marginTop: 20 },
  btnCancel: { flex: 1, alignItems: 'center', paddingVertical: 13, borderRadius: 12, borderWidth: 1 },
  btnSave: { flex: 1, alignItems: 'center', paddingVertical: 13, borderRadius: 12 },
});
