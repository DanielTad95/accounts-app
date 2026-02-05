export interface Tag {
  text: string;
}

export enum AccountType {
  LDAP = 'LDAP',
  LOCAL = 'Local',
}

export interface Account {
  id: string;
  tags: Tag[];
  type: AccountType;
  login: string;
  password: string | null;
}

export interface ValidationErrors {
  tags?: string;
  login?: string;
  password?: string;
}
