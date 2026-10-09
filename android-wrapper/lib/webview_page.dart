import 'package:flutter/material.dart';
import 'package:flutter_inappwebview/flutter_inappwebview.dart';
import 'package:cabsafar/constants.dart';
import 'package:cabsafar/services/notification_service.dart';
import 'package:url_launcher/url_launcher.dart';

class WebviewPage extends StatefulWidget {
  const WebviewPage({super.key});

  @override
  State<WebviewPage> createState() => WebviewPageState();
}

class WebviewPageState extends State<WebviewPage> {
  static InAppWebViewController? webViewController;

  String? _failedUrl;
  bool isLoading = true;
  bool _isInitialLoad = true;
  bool canGoBack = false;
  bool hasError = false;
  String? _registeredAccessToken;

  final webViewInitialSettings = InAppWebViewSettings(
    useHybridComposition: true,
    supportZoom: false,
    transparentBackground: true,
    allowsInlineMediaPlayback: true,
    mediaPlaybackRequiresUserGesture: false,
    allowContentAccess: true,
    allowFileAccess: true,
    allowFileAccessFromFileURLs: true,
    allowUniversalAccessFromFileURLs: true,
    underPageBackgroundColor: Colors.white,
    javaScriptCanOpenWindowsAutomatically: true,
    domStorageEnabled: true,
    cacheMode: CacheMode.LOAD_DEFAULT,
    cacheEnabled: true,
    clearCache: false,
    useShouldInterceptFetchRequest: true,
    useOnLoadResource: true,
  );

  late PullToRefreshController pullToRefreshController;

  void _updateCanGoBack() async {
    if (webViewController != null) {
      final value = await webViewController!.canGoBack();
      setState(() => canGoBack = value);
    }
  }

  @override
  void initState() {
    super.initState();
    pullToRefreshController = PullToRefreshController(
      onRefresh: () async {
        try {
          await webViewController?.reload();
        } finally {
          pullToRefreshController.endRefreshing();
        }
      },
      settings: PullToRefreshSettings(color: ColorManager.primary),
    );
  }

  @override
  Widget build(BuildContext context) {
    return PopScope(
      canPop: !canGoBack,
      onPopInvokedWithResult: (didPop, result) {
        if (!didPop) {
          setState(() {
            hasError = false;
          });
          webViewController?.goBack();
        }
      },
      child: ColoredBox(
        color: Colors.white,
        child: SafeArea(
          child: Scaffold(
            backgroundColor: Colors.white,
            body: Stack(
              children: [
                if (hasError) _buildErrorWidget(),
                ...[
                  _buildWebviewWidget(),
                  if (isLoading && _isInitialLoad) _buildLoadingWidget(),
                ],
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildWebviewWidget() {
    return InAppWebView(
      pullToRefreshController: pullToRefreshController,
      initialUrlRequest: URLRequest(
        url: WebUri(Constants.baseUrl),
        timeoutInterval: 7,
      ),
      onLoadStart: _onLoadStart,
      onLoadStop: _onLoadStop,
      onUpdateVisitedHistory: (controller, url, isReload) {
        _updateCanGoBack();
        _registerPushNotifications();
      },
      initialSettings: webViewInitialSettings,
      onWebViewCreated: (controller) => webViewController = controller,
      onPermissionRequest: (controller, request) async {
        return PermissionResponse(
          resources: request.resources,
          action: PermissionResponseAction.GRANT,
        );
      },
      onReceivedHttpError: (controller, request, errorResponse) {
        if (request.isForMainFrame ?? false) {
          _failedUrl = request.url.toString();
          showNetworkConnectionSnackBar();
          setState(() {
            hasError = true;
            isLoading = false;
          });
        }
      },
      onReceivedError: (controller, request, error) {
        if (request.isForMainFrame ?? false) {
          _failedUrl = request.url.toString();
          showNetworkConnectionSnackBar();
          setState(() {
            hasError = true;
            isLoading = false;
          });
        }
      },
      shouldOverrideUrlLoading: (_, navigationAction) async {
        final uri = navigationAction.request.url;
        if (uri != null) {
          if (uri.scheme == "tel" ||
              uri.scheme == "mailto" ||
              uri.scheme == "sms" ||
              uri.scheme == "whatsapp") {
            await launchUrl(uri.uriValue);
            return NavigationActionPolicy.CANCEL;
          }

          if (uri.uriValue.origin != Constants.siteOrigin) {
            await launchUrl(uri.uriValue);
            return NavigationActionPolicy.CANCEL;
          }
        }
        return NavigationActionPolicy.ALLOW;
      },
    );
  }

  void _onLoadStart(controller, url) {
    setState(() {
      if (_isInitialLoad) {
        isLoading = true;
      }
      hasError = false;
    });
  }

  void _onLoadStop(controller, url) async {
    try {
      pullToRefreshController.endRefreshing();
      _updateCanGoBack();
      await _registerPushNotifications();
    } finally {
      setState(() {
        isLoading = false;
        if (_isInitialLoad) {
          _isInitialLoad = false;
        }
      });
    }
  }

  Future<void> _registerPushNotifications() async {
    try {
      final accessToken = await _getAccessToken();
      if (accessToken == null || accessToken.isEmpty) {
        _registeredAccessToken = null;
        NotificationService().clearSession();
        return;
      }
      if (accessToken == _registeredAccessToken) return;

      if (await NotificationService().init(accessToken)) {
        _registeredAccessToken = accessToken;
      }
    } catch (error) {
      debugPrint('Could not register for push notifications: $error');
    }
  }

  Future<String?> _getAccessToken() async {
    final accessToken = await webViewController!.evaluateJavascript(
      source: "window.localStorage.getItem('access_token');",
    );
    return accessToken is String ? accessToken : null;
  }

  Widget _buildLoadingWidget() {
    return Container(
      color: Colors.white.withValues(alpha: 0.8),
      child: Center(
        child: CircularProgressIndicator(
          color: ColorManager.primary,
          strokeWidth: 3,
        ),
      ),
    );
  }

  Widget _buildErrorWidget() {
    return Container(
      color: Colors.white,
      child: Center(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(Icons.error_outline, color: ColorManager.primary, size: 60),
            const SizedBox(height: 16),
            const Text(
              'An error occurred while loading the page.',
              style: TextStyle(fontSize: 18),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 8),
            const Text(
              'Please check your connection.',
              style: TextStyle(fontSize: 14, color: Colors.grey),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 24),
            ElevatedButton(
              onPressed: () {
                if (_failedUrl != null) {
                  setState(() {
                    hasError = false;
                    isLoading = true;
                  });
                  webViewController?.loadUrl(
                    urlRequest: URLRequest(url: WebUri(_failedUrl!)),
                  );
                }
              },
              style: ElevatedButton.styleFrom(
                backgroundColor: ColorManager.primary,
                padding: const EdgeInsets.symmetric(
                  horizontal: 32,
                  vertical: 12,
                ),
              ),
              child: const Text(
                'Please try again',
                style: TextStyle(fontSize: 16, color: Colors.white),
              ),
            ),
          ],
        ),
      ),
    );
  }

  void showNetworkConnectionSnackBar() {
    ScaffoldMessenger.of(context).removeCurrentSnackBar();
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        backgroundColor: Colors.blueGrey.shade800,
        padding: const EdgeInsets.all(10),
        content: const Row(
          children: [
            Text(
              'The internet connection has been disconnected.',
              style: TextStyle(fontSize: 14, color: Colors.white),
            ),
            SizedBox(width: 5),
            Icon(Icons.wifi_off_rounded, color: Colors.white),
          ],
        ),
      ),
    );
  }
}
