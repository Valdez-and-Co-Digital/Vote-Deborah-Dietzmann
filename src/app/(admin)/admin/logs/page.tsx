import { createClient } from '@/utils/supabase/server'

export default async function AuditLogsPage() {
  const supabase = await createClient()

  const { data: logs, error } = await supabase
    .from('audit_logs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(100)

  return (
    <div className="max-w-5xl mx-auto py-8">
      <div className="mb-8">
        <h1 className="font-headline-lg text-primary mb-2">Audit Logs</h1>
        <p className="font-body-md text-legal-gray">Track all changes made to campaign data through the dashboard.</p>
      </div>

      <div className="bg-neutral-white border border-outline-variant rounded-2xl p-6 shadow-sm overflow-hidden">
        {error ? (
          <div className="p-4 text-error font-body-md">
            Note: Audit Logs table has not been created yet or there was an error fetching logs. 
            ({error.message})
          </div>
        ) : !logs || logs.length === 0 ? (
          <div className="p-12 text-center text-legal-gray font-body-md italic">
            No changes have been logged yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-outline-variant">
                  <th className="py-4 px-4 font-label-bold text-primary text-xs uppercase tracking-wider">Timestamp</th>
                  <th className="py-4 px-4 font-label-bold text-primary text-xs uppercase tracking-wider">Admin User</th>
                  <th className="py-4 px-4 font-label-bold text-primary text-xs uppercase tracking-wider">Action</th>
                  <th className="py-4 px-4 font-label-bold text-primary text-xs uppercase tracking-wider">Type</th>
                  <th className="py-4 px-4 font-label-bold text-primary text-xs uppercase tracking-wider">Record Changed</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/30">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-surface-container-lowest transition-colors">
                    <td className="py-4 px-4 font-body-sm text-legal-gray whitespace-nowrap">
                      {new Date(log.created_at).toLocaleString()}
                    </td>
                    <td className="py-4 px-4 font-body-md text-on-surface">
                      {log.user_email || log.user_id || 'System / Unknown'}
                    </td>
                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        log.action === 'INSERT' ? 'bg-green-100 text-green-800' :
                        log.action === 'UPDATE' ? 'bg-blue-100 text-blue-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="py-4 px-4 font-body-md text-on-surface capitalize">
                      {log.entity_type}
                    </td>
                    <td className="py-4 px-4 font-body-md text-on-surface font-medium">
                      {log.entity_name}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
