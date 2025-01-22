import type { ColumnType } from "kysely";
export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;
export type Timestamp = ColumnType<Date, Date | string, Date | string>;

export type Group = {
    id: Generated<number>;
    title: string;
    created_at: Generated<Timestamp>;
    updated_at: Timestamp;
};
export type Item = {
    id: Generated<number>;
    title: string;
    created_at: Generated<Timestamp>;
    updated_at: Timestamp;
};
export type ItemToGroup = {
    item_id: number;
    group_id: number;
    created_at: Generated<Timestamp>;
    updated_at: Timestamp;
};
export type User = {
    id: Generated<number>;
    username: string;
    created_at: Generated<Timestamp>;
    updated_at: Timestamp;
};
export type UserToGroup = {
    user_id: number;
    group_id: number;
    created_at: Generated<Timestamp>;
    updated_at: Timestamp;
};
export type DB = {
    groups: Group;
    items: Item;
    items_to_groups: ItemToGroup;
    users: User;
    users_to_groups: UserToGroup;
};
