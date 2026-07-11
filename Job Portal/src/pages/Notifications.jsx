import { useEffect, useState, useMemo } from "react";
import { Bell, Search, Info, ChevronLeft, ChevronRight, RefreshCw } from "lucide-react";
import DashboardLayout from "../layouts/DashboardLayout";
import { getNotifications } from "../services/publicApi";
import toast from "react-hot-toast";

export default function Notifications() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const response = await getNotifications({ page: 1, limit: 100 });
      setData(response.notifications || []);
    } catch (err) {
      toast.error(err.message || "Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  // Filter items
  const filteredItems = useMemo(() => {
    return data.filter((item) => {
      const matchSearch =
        item.title?.toLowerCase().includes(search.toLowerCase()) ||
        item.Descripton?.toLowerCase().includes(search.toLowerCase());

      return matchSearch;
    });
  }, [data, search]);

  // Paginate items
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage) || 1;
  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredItems.slice(start, start + itemsPerPage);
  }, [filteredItems, currentPage]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [filteredItems, currentPage, totalPages]);

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold flex items-center gap-2">
            <Bell className="text-[color:var(--ncc-maroon)] h-7 w-7" />
            General Notifications
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Stay updated with official announcements, schedules, and circulars.
          </p>
        </div>
        <button
          onClick={fetchNotifications}
          className="flex items-center gap-1.5 text-xs font-semibold btn-outline max-w-max px-3 py-2"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} /> Refresh
        </button>
      </div>

      {/* Search Filter */}
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-3 h-4.5 w-4.5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search notification title or content..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-11 pl-10 pr-4 rounded-xl border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/45"
          />
        </div>
      </div>

      {/* Tabular View */}
      <div className="mt-6 card-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-muted text-muted-foreground text-xs font-bold uppercase tracking-wider border-b border-border">
                <th className="p-4 sm:p-5 w-16 text-center">Status</th>
                <th className="p-4 sm:p-5">Announcement Title</th>
                <th className="p-4 sm:p-5">Details / Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60 text-sm">
              {loading ? (
                <tr>
                  <td colSpan="3" className="p-10 text-center text-muted-foreground">
                    <div className="flex justify-center items-center gap-2">
                      <RefreshCw className="h-5 w-5 animate-spin text-primary" /> Loading notifications...
                    </div>
                  </td>
                </tr>
              ) : paginatedItems.length === 0 ? (
                <tr>
                  <td colSpan="3" className="p-10 text-center text-muted-foreground">
                    No announcements found matching filter criteria.
                  </td>
                </tr>
              ) : (
                paginatedItems.map((item) => (
                  <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                    <td className="p-4 sm:p-5 text-center">
                      <div className="h-8 w-8 rounded-full bg-[color:var(--ncc-maroon)]/8 border border-[color:var(--ncc-maroon)]/15 grid place-items-center mx-auto">
                        <Info className="h-4 w-4 text-[color:var(--ncc-maroon)]" />
                      </div>
                    </td>
                    <td className="p-4 sm:p-5 font-bold text-foreground min-w-[200px]">
                      {item.title}
                    </td>
                    <td className="p-4 sm:p-5 text-muted-foreground leading-relaxed whitespace-pre-line">
                      {item.Descripton || (
                        <span className="text-xs italic text-muted-foreground/60">No additional details provided</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination controls */}
        {!loading && filteredItems.length > 0 && (
          <div className="p-4 bg-muted/20 border-t border-border flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              Showing <strong className="text-foreground">{(currentPage - 1) * itemsPerPage + 1}</strong> to{" "}
              <strong className="text-foreground">
                {Math.min(currentPage * itemsPerPage, filteredItems.length)}
              </strong>{" "}
              of <strong className="text-foreground">{filteredItems.length}</strong> items
            </span>
            <div className="flex items-center gap-1.5">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="p-2 rounded-lg border border-border bg-card text-muted-foreground hover:text-foreground disabled:opacity-40 transition-colors"
                aria-label="Previous page"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="text-xs font-semibold px-2">
                Page {currentPage} of {totalPages}
              </span>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="p-2 rounded-lg border border-border bg-card text-muted-foreground hover:text-foreground disabled:opacity-40 transition-colors"
                aria-label="Next page"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
