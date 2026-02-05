<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { Plus, QuestionFilled } from '@element-plus/icons-vue'
import { useAccountStore } from '@/stores/accountStore'
import AccountItem from '@/components/AccountItem.vue'
import type { Account, AccountType } from '@/types/account'

const accountStore = useAccountStore()
const { accounts } = storeToRefs(accountStore)

const generateId = (): string => {
  return `account-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

const addNewAccount = () => {
  const newAccount: Account = {
    id: generateId(),
    tags: [],
    type: 'Local' as AccountType,
    login: '',
    password: '',
  }
  accountStore.addAccount(newAccount)
}

const updateAccount = (account: Account) => {
  accountStore.updateAccount(account.id, account)
}

const deleteAccount = (id: string) => {
  accountStore.deleteAccount(id)
}
</script>

<template>
  <div class="accounts-container">
    <div class="header">
      <div class="title-section">
        <h1>Учетные записи</h1>
        <el-button
          type="primary"
          :icon="Plus"
          circle
          @click="addNewAccount"
          class="add-btn"
        />
      </div>
      
      <el-alert
        type="info"
        :closable="false"
        class="hint"
      >
        <template #title>
          <div class="hint-content">
            <el-icon><QuestionFilled /></el-icon>
            <span>Для указания нескольких меток для одной пары логин/пароль используйте разделитель ;</span>
          </div>
        </template>
      </el-alert>
    </div>

    <div v-if="accounts.length === 0" class="empty-state">
      <p>Нет учетных записей</p>
      <p class="empty-hint">Нажмите на кнопку "+" чтобы добавить новую запись</p>
    </div>

    <div v-else class="accounts-list">
      <AccountItem
        v-for="account in accounts"
        :key="account.id"
        :account="account"
        @update="updateAccount"
        @delete="deleteAccount"
      />
    </div>
  </div>
</template>

<style scoped>
.accounts-container {
  max-width: 1200px;
  margin: 0 auto;
}

.header {
  margin-bottom: 24px;
}

.title-section {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
}

h1 {
  font-size: 24px;
  font-weight: 600;
  color: #303133;
  margin: 0;
}

.add-btn {
  font-size: 20px;
}

.hint {
  border-radius: 8px;
}

.hint-content {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.empty-state p {
  margin: 0;
  color: #909399;
}

.empty-state p:first-child {
  font-size: 18px;
  margin-bottom: 8px;
}

.empty-hint {
  font-size: 14px;
}

.accounts-list {
  display: flex;
  flex-direction: column;
}
</style>
