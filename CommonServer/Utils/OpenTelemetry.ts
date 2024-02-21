import * as opentelemetry from '@opentelemetry/sdk-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-proto';
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-proto';
import { PeriodicExportingMetricReader } from '@opentelemetry/sdk-metrics';
import { HttpInstrumentation } from '@opentelemetry/instrumentation-http';
import { ExpressInstrumentation } from '@opentelemetry/instrumentation-express';
import Dictionary from 'Common/Types/Dictionary';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import {
    LoggerProvider,
    BatchLogRecordProcessor,
} from '@opentelemetry/sdk-logs';
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import { SeverityNumber } from '@opentelemetry/api-logs';

let sdk: opentelemetry.NodeSDK | null = null;

if (
    process.env['OTEL_EXPORTER_OTLP_ENDPOINT'] &&
    process.env['OTEL_EXPORTER_OTLP_HEADERS']
) {
    const headersStrings: Array<string> =
        process.env['OTEL_EXPORTER_OTLP_HEADERS'].split(';');

    const headers: Dictionary<string> = {};

    for (const headerString of headersStrings) {
        const header: Array<string> = headerString.split('=');
        if (header.length === 2) {
            headers[header[0]!.toString()] = header[1]!.toString();
        }
    }

    const otlpEndpoint: string = process.env['OTEL_EXPORTER_OTLP_ENDPOINT'];

    const logExporter = new OTLPLogExporter({
        url: otlpEndpoint + '/v1/logs',
        headers: headers,
    });

    const loggerProvider = new LoggerProvider();

    loggerProvider.addLogRecordProcessor(new BatchLogRecordProcessor(logExporter));

    const logger = loggerProvider.getLogger('default', '1.0.0');

    // Emit a log
    logger.emit({
        severityNumber: SeverityNumber.INFO,
        severityText: 'info',
        body: 'this is a log body',
        attributes: { 'log.type': 'custom' },
    });


    sdk = new opentelemetry.NodeSDK({
        traceExporter: new OTLPTraceExporter({
            url: otlpEndpoint + '/v1/traces',
            headers: headers,
        }),
        metricReader: new PeriodicExportingMetricReader({
            exporter: new OTLPMetricExporter({
                url: otlpEndpoint + '/v1/metrics',
                headers: headers,
            }),
        }) as any,
        instrumentations: [
            new HttpInstrumentation(),
            new ExpressInstrumentation(),
            getNodeAutoInstrumentations(),
        ],
    });

    process.on('SIGTERM', () => {
        sdk!.shutdown()
            .then(() => console.log('Tracing terminated'))
            .catch((error) => console.log('Error terminating tracing', error))
            .finally(() => process.exit(0));
    });

    sdk.start();
}

export default sdk;
