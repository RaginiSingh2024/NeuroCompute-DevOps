# Monitoring

Prometheus monitors application metrics and node exporters. Grafana visualizes metrics and dashboards.

1. Prometheus
- Use monitoring/prometheus.yml for scrape jobs.
- Configure Prometheus to scrape kubelet, node-exporter, and app endpoints.

2. Grafana
- Import monitoring/grafana/dashboard.json as a starter dashboard.

3. Alerts
- monitoring/alert-rules.yml contains example alert rules. Connect to Alertmanager to route alerts to email/Slack.

4. Logs
- ELK stack ingest logs via filebeat/logstash and store in Elasticsearch. Kibana provides UI.

5. Recommendations
- Use kubernetes service discovery for Prometheus in production.
- Use RBAC and secure endpoints.
