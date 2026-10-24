// apps/mobile/src/store/AppStore.tsx
// In-memory app state for the prototype: bookings, follows and chat messages.
// Booking statuses follow the PRD state machine (section 8.1); escrow moves are simulated.
import { createContext, useContext, useMemo, useReducer, type ReactNode } from 'react';

import { chats as seedChats, providers, type Chat, type Message } from '@/data/mock';
import { breakdown } from '@/lib/money';

export type BookingStatus = 'REQUESTED' | 'ACCEPTED' | 'FUNDED' | 'DELIVERED' | 'COMPLETED' | 'DISPUTED' | 'CANCELLED';

export type BookingEvent = { status: BookingStatus; label: string; at: string };

export type Booking = {
  id: string;
  providerId: string;
  listingId: string;
  title: string;
  price: number;
  escrowFee: number;
  total: number;
  date: string;
  time: string;
  place: string;
  notes: string;
  status: BookingStatus;
  events: BookingEvent[];
  rating?: number;
};

type State = {
  bookings: Booking[];
  following: Record<string, boolean>;
  chats: Chat[];
};

type Action =
  | { type: 'createBooking'; booking: Booking }
  | { type: 'advance'; id: string; status: BookingStatus; label: string }
  | { type: 'rate'; id: string; rating: number }
  | { type: 'toggleFollow'; providerId: string }
  | { type: 'sendMessage'; chatId: string; providerId: string; text: string };

const now = () => {
  const d = new Date();
  return d.toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'createBooking':
      return { ...state, bookings: [action.booking, ...state.bookings] };
    case 'advance':
      return {
        ...state,
        bookings: state.bookings.map((b) =>
          b.id === action.id
            ? { ...b, status: action.status, events: [...b.events, { status: action.status, label: action.label, at: now() }] }
            : b,
        ),
      };
    case 'rate':
      return { ...state, bookings: state.bookings.map((b) => (b.id === action.id ? { ...b, rating: action.rating } : b)) };
    case 'toggleFollow':
      return { ...state, following: { ...state.following, [action.providerId]: !state.following[action.providerId] } };
    case 'sendMessage': {
      const msg: Message = {
        id: `m${Date.now()}`,
        from: 'me',
        text: action.text,
        time: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
      };
      const exists = state.chats.some((c) => c.id === action.chatId);
      const chats = exists
        ? state.chats.map((c) => (c.id === action.chatId ? { ...c, messages: [...c.messages, msg], updated: 'now' } : c))
        : [
            { id: action.chatId, providerId: action.providerId, pinned: false, unread: 0, updated: 'now', messages: [msg] },
            ...state.chats,
          ];
      return { ...state, chats };
    }
  }
}

const seedBooking = (): Booking => {
  const b = breakdown(8000);
  return {
    id: 'bk-demo',
    providerId: 'abena',
    listingId: 'abena-flyer',
    title: 'Flyer design',
    price: b.price,
    escrowFee: b.escrowFee,
    total: b.total,
    date: 'Mon 5 Oct',
    time: 'Afternoon (1pm)',
    place: 'Lecture block',
    notes: 'Flyer for our departmental week.',
    status: 'FUNDED',
    events: [
      { status: 'REQUESTED', label: 'Request sent', at: '5 Oct, 09:02' },
      { status: 'ACCEPTED', label: 'Abena accepted', at: '5 Oct, 09:40' },
      { status: 'FUNDED', label: 'Payment secured in escrow', at: '5 Oct, 09:44' },
    ],
  };
};

type Store = State & {
  createBooking: (b: Omit<Booking, 'id' | 'status' | 'events'>) => string;
  advance: (id: string, status: BookingStatus, label: string) => void;
  rate: (id: string, rating: number) => void;
  toggleFollow: (providerId: string) => void;
  sendMessage: (chatId: string, providerId: string, text: string) => void;
};

const Ctx = createContext<Store | null>(null);

export function AppStoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, () => ({
    bookings: [seedBooking()],
    following: Object.fromEntries(providers.map((p) => [p.id, p.following])),
    chats: seedChats,
  }));

  const store = useMemo<Store>(
    () => ({
      ...state,
      createBooking: (b) => {
        const id = `bk-${Date.now()}`;
        dispatch({
          type: 'createBooking',
          booking: { ...b, id, status: 'REQUESTED', events: [{ status: 'REQUESTED', label: 'Request sent', at: now() }] },
        });
        return id;
      },
      advance: (id, status, label) => dispatch({ type: 'advance', id, status, label }),
      rate: (id, rating) => dispatch({ type: 'rate', id, rating }),
      toggleFollow: (providerId) => dispatch({ type: 'toggleFollow', providerId }),
      sendMessage: (chatId, providerId, text) => dispatch({ type: 'sendMessage', chatId, providerId, text }),
    }),
    [state],
  );

  return <Ctx.Provider value={store}>{children}</Ctx.Provider>;
}

export function useApp(): Store {
  const store = useContext(Ctx);
  if (!store) throw new Error('useApp must be used inside AppStoreProvider');
  return store;
}