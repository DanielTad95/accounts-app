<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { Delete, View, Hide } from '@element-plus/icons-vue'
import type { Account, ValidationErrors } from '@/types/account'

interface Props {
  account: Account
}

interface Emits {
  (e: 'update', account: Account): void
  (e: 'delete', id: string): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const localAccount = ref<Account>({ ...props.account })
const errors = ref<ValidationErrors>({})
const showPassword = ref(false)

const tagsString = computed({
  get: () => localAccount.value.tags.map(tag => tag.text).join(';'),
  set: (value: string) => {
    localAccount.value.tags = value
      ? value.split(';').map(text => ({ text: text.trim() })).filter(tag => tag.text)
      : []
  }
})

const isLDAP = computed(() => localAccount.value.type === 'LDAP')

watch(() => localAccount.value.type, (newType) => {
  if (newType === 'LDAP') {
    localAccount.value.password = null
    delete errors.value.password
  } else if (newType === 'Local' && localAccount.value.password === null) {
    localAccount.value.password = ''
  }
})

const validateField = (field: keyof Account): boolean => {
  switch (field) {
    case 'tags':
      if (tagsString.value.length > 50) {
        errors.value.tags = 'Max 50 characters'
        return false
      }
      delete errors.value.tags
      return true

    case 'login':
      if (!localAccount.value.login.trim()) {
        errors.value.login = 'Required field'
        return false
      }
      if (localAccount.value.login.length > 100) {
        errors.value.login = 'Max 100 characters'
        return false
      }
      delete errors.value.login
      return true

    case 'password':
      if (!isLDAP.value) {
        if (!localAccount.value.password?.trim()) {
          errors.value.password = 'Required field'
          return false
        }
        if (localAccount.value.password && localAccount.value.password.length > 100) {
          errors.value.password = 'Max 100 characters'
          return false
        }
      }
      delete errors.value.password
      return true

    default:
      return true
  }
}

const validateAll = (): boolean => {
  const tagsValid = validateField('tags')
  const loginValid = validateField('login')
  const passwordValid = validateField('password')
  return tagsValid && loginValid && passwordValid
}

const handleBlur = (field: keyof Account) => {
  validateField(field)
  if (validateAll()) {
    emit('update', localAccount.value)
  }
}

const handleTypeChange = () => {
  validateField('password')
  if (validateAll()) {
    emit('update', localAccount.value)
  }
}

const handleDelete = () => {
  emit('delete', localAccount.value.id)
}
</script>

<template>
  <div class="account-item">
    <div class="account-fields">
      <div class="field">
        <label>Метка</label>
        <el-input
          v-model="tagsString"
          placeholder="XXX"
          maxlength="50"
          :class="{ 'is-error': errors.tags }"
          @blur="handleBlur('tags')"
        />
        <span v-if="errors.tags" class="error-message">{{ errors.tags }}</span>
      </div>

      <div class="field">
        <label>Тип записи</label>
        <el-select
          v-model="localAccount.type"
          placeholder="Select type"
          @change="handleTypeChange"
        >
          <el-option label="Локальная" value="Local" />
          <el-option label="LDAP" value="LDAP" />
        </el-select>
      </div>

      <div class="field">
        <label>Логин</label>
        <el-input
          v-model="localAccount.login"
          placeholder="Value"
          maxlength="100"
          :class="{ 'is-error': errors.login }"
          @blur="handleBlur('login')"
        />
        <span v-if="errors.login" class="error-message">{{ errors.login }}</span>
      </div>

      <div v-if="!isLDAP" class="field">
        <label>Пароль</label>
        <el-input
          v-model="localAccount.password"
          :type="showPassword ? 'text' : 'password'"
          placeholder="Value"
          maxlength="100"
          :class="{ 'is-error': errors.password }"
          @blur="handleBlur('password')"
        >
          <template #suffix>
            <el-icon
              class="password-toggle"
              @click="showPassword = !showPassword"
            >
              <View v-if="!showPassword" />
              <Hide v-else />
            </el-icon>
          </template>
        </el-input>
        <span v-if="errors.password" class="error-message">{{ errors.password }}</span>
      </div>
    </div>

    <el-button
      type="danger"
      :icon="Delete"
      circle
      @click="handleDelete"
      class="delete-btn"
    />
  </div>
</template>

<style scoped>
.account-item {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  padding: 16px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-bottom: 12px;
}

.account-fields {
  display: flex;
  gap: 12px;
  flex: 1;
  flex-wrap: wrap;
}

.field {
  flex: 1;
  min-width: 200px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.field label {
  font-size: 12px;
  color: #606266;
  font-weight: 500;
}

.is-error :deep(.el-input__wrapper) {
  border-color: #f56c6c !important;
  box-shadow: 0 0 0 1px #f56c6c inset !important;
}

.error-message {
  font-size: 12px;
  color: #f56c6c;
  margin-top: 2px;
}

.password-toggle {
  cursor: pointer;
}

.delete-btn {
  margin-top: 20px;
  flex-shrink: 0;
}

@media (max-width: 768px) {
  .account-item {
    flex-direction: column;
  }

  .account-fields {
    width: 100%;
  }

  .field {
    min-width: 100%;
  }

  .delete-btn {
    align-self: flex-end;
    margin-top: 0;
  }
}
</style>
