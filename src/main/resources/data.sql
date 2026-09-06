-- Incidents
INSERT INTO incidents (ticket_id, title, asset_name, severity, status, assigned_to, created_at) VALUES
                                                                                                    ('INC-101', 'High CPU Spike Alert', 'Critical Router/Switch', 'CRITICAL', 'OPEN', 'Dhanashree (Admin)', CURRENT_TIMESTAMP),
                                                                                                    ('INC-102', 'Memory Usage Exceeded 80%', 'AWS-EC2-WEB-NODE', 'MEDIUM', 'IN_PROGRESS', 'DevOps Team', CURRENT_TIMESTAMP);

-- Vulnerabilities
INSERT INTO vulnerabilities (cve_id, description, asset_name, severity, patch_status) VALUES
                                                                                          ('CVE-2026-3021', 'Log4j Remote Code Execution Vulnerability', 'PROD-DB-SRV-01', 'CRITICAL', 'AVAILABLE'),
                                                                                          ('CVE-2026-1189', 'OpenSSL Out-of-bounds Read', 'AWS-EC2-WEB-NODE', 'HIGH', 'PENDING');

-- Audit Logs
INSERT INTO audit_logs (timestamp, username, action, details, ip_address) VALUES
                                                                              (CURRENT_TIMESTAMP, 'Dhanashree (ADMIN)', 'ASSET_CREATED', 'Added new cloud node AWS-EC2-WEB-NODE', '192.168.1.45'),
                                                                              (CURRENT_TIMESTAMP, 'System Agent', 'METRIC_SYNC', 'Automated health metric pulse synced', '127.0.0.1');

-- Compliance Checks
INSERT INTO compliance_checks (framework, control_name, status, last_scanned) VALUES
                                                                                  ('CIS Benchmark', 'Ensure SSH Root Login Disabled', 'PASSED', CURRENT_TIMESTAMP),
                                                                                  ('ISO 27001', 'Enforce MFA for Admin Accounts', 'PASSED', CURRENT_TIMESTAMP),
                                                                                  ('SOC2', 'S3 Bucket Encryption at Rest', 'FAILED', CURRENT_TIMESTAMP);