const changeStatus = async (newStatus, reason = "") => {
  try {
    setLoading(true);

    const res = await fetch("https://api.fundednaira.ng/api/admin/update-account-status.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: selectedAccount.id,
        status: newStatus,
        reason,
      }),
    });

    const data = await res.json();

    if (!data.success) {
      alert(data.message || "Failed to update account status.");
      return;
    }

    alert(data.message || "Status updated successfully.");

    if (typeof refreshAccounts === "function") {
      await refreshAccounts();
    }

    closeModal();
  } catch (error) {
    console.error("Status update error:", error);
    alert("Something went wrong while updating the account status.");
  } finally {
    setLoading(false);
  }
};
