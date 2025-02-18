/* ? This is a type file
? You should define all your types here
? Here have an example of how to define a type
? export type typename = { first_var: first_var_type; second_var: second_var_type; };
? You can import type to anywhere like this
? import { typename, playerData } from '@/types';
 */

export type PlayerData = {
  token: string; //
  name: string; // data.user_id
  avatar?: string; //
  linktree?: string; //
};

export type CouponData = {
  couponId?: string; // generate by server
  type?: number; // set discount
  used?: boolean; // default when true can't use
};
