"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { AddressCard } from "@/components/account/AddressCard";
import { AddressForm } from "@/components/account/AddressForm";
import { ApiError } from "@/lib/api";
import { getApiErrorMessage } from "@/lib/api-errors";
import type { Address, AddressPayload } from "@/lib/address-api";
import {
  createAddress,
  deleteAddress,
  fetchAddresses,
  setDefaultAddress,
  updateAddress,
} from "@/lib/address-api";
import { useCustomerAuthStore } from "@/lib/customer-auth-store";
import { MAX_ADDRESSES } from "@/lib/validation";

export function AddressManager() {
  const access = useCustomerAuthStore((s) => s.access);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [editing, setEditing] = useState<Address | null>(null);
  const [showForm, setShowForm] = useState(false);

  const [reloadKey, setReloadKey] = useState(0);

  const atMax = addresses.length >= MAX_ADDRESSES;

  const reloadAddresses = useCallback(async () => {
    if (!access) return;
    setLoading(true);
    setLoadError(null);
    try {
      const data = await fetchAddresses(access);
      setAddresses(data);
    } catch {
      setLoadError("Could not load addresses.");
    } finally {
      setLoading(false);
    }
  }, [access]);

  useEffect(() => {
    if (!access) return;
    let cancelled = false;
    fetchAddresses(access)
      .then((data) => {
        if (!cancelled) setAddresses(data);
      })
      .catch(() => {
        if (!cancelled) setLoadError("Could not load addresses.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [access, reloadKey]);

  const openAddForm = () => {
    setEditing(null);
    setShowForm(true);
    setActionError(null);
    setSuccess(null);
  };

  const openEditForm = (address: Address) => {
    setShowForm(false);
    setEditing(address);
    setActionError(null);
    setSuccess(null);
  };

  const handleCreate = async (payload: AddressPayload) => {
    if (!access) return;
    try {
      await createAddress(access, payload);
      setShowForm(false);
      setSuccess("Address added.");
      setActionError(null);
      await reloadAddresses();
    } catch (err) {
      throw err;
    }
  };

  const handleUpdate = async (payload: AddressPayload) => {
    if (!access || !editing) return;
    try {
      await updateAddress(access, editing.id, payload);
      setEditing(null);
      setSuccess("Address updated.");
      setActionError(null);
      await reloadAddresses();
    } catch (err) {
      throw err;
    }
  };

  const handleDelete = async (address: Address) => {
    if (!access) return;
    const message =
      address.is_default && addresses.length > 1
        ? "Delete this default address? Another address will become the default."
        : "Delete this address?";
    if (!window.confirm(message)) return;

    setBusyId(address.id);
    setActionError(null);
    setSuccess(null);
    try {
      await deleteAddress(access, address.id);
      if (editing?.id === address.id) setEditing(null);
      setSuccess("Address deleted.");
      await reloadAddresses();
    } catch (err) {
      setActionError(
        err instanceof ApiError
          ? getApiErrorMessage(err)
          : "Could not delete address.",
      );
    } finally {
      setBusyId(null);
    }
  };

  const handleSetDefault = async (address: Address) => {
    if (!access) return;
    setBusyId(address.id);
    setActionError(null);
    setSuccess(null);
    try {
      await setDefaultAddress(access, address.id);
      setSuccess("Default address updated.");
      await reloadAddresses();
    } catch (err) {
      setActionError(
        err instanceof ApiError
          ? getApiErrorMessage(err)
          : "Could not update default address.",
      );
    } finally {
      setBusyId(null);
    }
  };

  if (loading) {
    return <p className="text-sm text-muted">Loading addresses…</p>;
  }

  if (loadError && addresses.length === 0) {
    return (
      <div className="space-y-4">
        <p className="border border-sale/30 bg-sale/5 px-4 py-3 text-sm text-sale">
          {loadError}
        </p>
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            setLoadError(null);
            setLoading(true);
            setReloadKey((k) => k + 1);
          }}
        >
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm text-muted">
          {addresses.length === 0
            ? "No saved addresses yet."
            : `${addresses.length} of ${MAX_ADDRESSES} saved address${addresses.length === 1 ? "" : "es"}`}
        </p>
        {!showForm && !editing && (
          <Button type="button" onClick={openAddForm} disabled={atMax}>
            Add new address
          </Button>
        )}
      </div>

      {atMax && (
        <p className="text-sm text-muted">
          You&apos;ve reached the maximum of {MAX_ADDRESSES} addresses. Delete one to add another.
        </p>
      )}

      {loadError && (
        <div className="flex flex-wrap items-center justify-between gap-3 border border-border bg-surface px-4 py-3 text-sm">
          <p className="text-muted">{loadError}</p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              setLoadError(null);
              setLoading(true);
              setReloadKey((k) => k + 1);
            }}
          >
            Retry
          </Button>
        </div>
      )}

      {actionError && (
        <p className="border border-sale/30 bg-sale/5 px-4 py-3 text-sm text-sale">
          {actionError}
        </p>
      )}

      {success && (
        <p className="border border-accent/30 bg-accent/5 px-4 py-3 text-sm text-accent">
          {success}
        </p>
      )}

      {showForm && (
        <AddressForm
          key="new-address"
          isFirstAddress={addresses.length === 0}
          onSubmit={handleCreate}
          onCancel={() => setShowForm(false)}
        />
      )}

      {editing && (
        <AddressForm
          key={editing.id}
          initial={editing}
          lockDefault={addresses.length === 1 && editing.is_default}
          onSubmit={handleUpdate}
          onCancel={() => setEditing(null)}
          submitLabel="Update address"
        />
      )}

      {addresses.length === 0 && !showForm && (
        <div className="border border-dashed border-border px-6 py-10 text-center">
          <p className="text-sm text-muted">
            Save an address for faster checkout.
          </p>
          <Button type="button" className="mt-4" onClick={openAddForm}>
            Add your first address
          </Button>
        </div>
      )}

      <div className="space-y-4">
        {addresses
          .filter((address) => address.id !== editing?.id)
          .map((address) => (
            <AddressCard
              key={address.id}
              address={address}
              busy={busyId === address.id}
              onEdit={openEditForm}
              onDelete={handleDelete}
              onSetDefault={handleSetDefault}
            />
          ))}
      </div>
    </div>
  );
}
