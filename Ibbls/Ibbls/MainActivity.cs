using Android.App;
using Android.Widget;
using Android.OS;
using Android.Webkit;
using Android.Views;
using System;
using Android.Content;

namespace Ibbls
{
    [Activity(Label = "Ibbls", MainLauncher = true, Icon = "@drawable/icon", Theme = "@android:style/Theme.NoTitleBar")]
    public class MainActivity : Activity
    {
        private WebView web_view;

        protected override void OnCreate(Bundle bundle)
        {
            base.OnCreate(bundle);
            string url = "https://ibbls.herokuapp.com/#/";


            var uri = Android.Net.Uri.Parse(url);
            var intent = new Intent(Intent.ActionView, uri);

            StartActivity(intent);
            Process.KillProcess(Process.MyPid());

            /*
            SetContentView(Resource.Layout.Main);
            web_view = FindViewById<WebView>(Resource.Id.webview);
            web_view.Settings.JavaScriptEnabled = true;

            // web_view.Settings.JavaScriptCanOpenWindowsAutomatically = true;
            // web_view.Settings.AllowUniversalAccessFromFileURLs = true;
            // web_view.Settings.LoadWithOverviewMode = true;
            //web_view.Settings.AllowContentAccess = true;
           // web_view
            web_view.LoadUrl(url);
            //web_view.LoadUrl("https://www.facebook.com");
            //web_view.LoadUrl("https://www.google.com");
            web_view.SetWebViewClient(new HelloWebViewClient(url));
            */
        }

        public class HelloWebViewClient : WebViewClient
        {
            Boolean loadingFinished = true;
            Boolean redirect = false;
            string currUrl;

            public HelloWebViewClient(string curr_url): base()
            {
                currUrl = curr_url;
            }

            public override bool ShouldOverrideUrlLoading(WebView view, string url)
            {
                if (!loadingFinished)
                {
                    redirect = true;
                }

                loadingFinished = false;
                view.LoadUrl(url);
                Console.WriteLine("Loading web view...");
                return true;
            }

            public override void OnPageStarted(WebView view, string url, Android.Graphics.Bitmap favicon)
            {
                base.OnPageStarted(view, url, favicon);
                loadingFinished = false;
            }



            public override void OnPageFinished(WebView view, string url)
            {
                if (url != this.currUrl)
                {
                    if (!redirect)
                    {
                        loadingFinished = true;
                    }

                    if (loadingFinished && !redirect)
                    {
                        view.LoadUrl(url);
                        loadingFinished = false;
                        this.currUrl = url;
                    }
                    else
                    {
                        redirect = false;
                    }
                }
            }
        }

        public override bool OnKeyDown(Android.Views.Keycode keyCode, Android.Views.KeyEvent e)
        {
            if (keyCode == Keycode.Back && web_view.CanGoBack())
            {
                web_view.GoBack();
                return true;
            }
            return base.OnKeyDown(keyCode, e);
        }
    }
}

