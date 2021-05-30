#include <iostream>

using namespace std;

#define fastio ios::sync_with_stdio(0); cin.tie(0); cout.tie(0);
#define ll short int
#define rep(i, st, n) for (ll i = st; i < n; i++)

ll arr[1000][1000], arr_sort[1000][1000];

void merge_arr(ll n1, ll n2, ll m1, ll m2, ll i1, ll i2, ll j1, ll j2, bool dir)
{
    if (dir)
    {
        rep (i, i1, n1 + i1)
        {
            ll in1 = j1, in2 = j2, j = j1;

            for (; in1 - j1 < m1 && in2 - j2 < m2; j++)
            {
                if (arr[i][in1] < arr[i][in2])
                    arr_sort[i][j] = arr[i][in1++];
                else
                    arr_sort[i][j] = arr[i][in2++];
            }

            if (in1 - j1 < m1)
            {
                for (; in1 - j1 < m1; in1++, j++)
                    arr_sort[i][j] = arr[i][in1];
            }
            else
            {
                for (; in2 - j2 < m2; in2++, j++)
                    arr_sort[i][j] = arr[i][in2];
            }
        }

        rep (i, i1, n1 + i1)
            rep (j, j1, m1 + m2 + j1)
                arr[i][j] = arr_sort[i][j];
    }
    else
    {
        rep (j, j1, m1 + j1)
        {
            ll in1 = i1, in2 = i2, i = i1;

            for (; in1 - i1 < n1 && in2 - i2 < n2; i++)
            {
                if (arr[in1][j] < arr[in2][j])
                    arr_sort[i][j] = arr[in1++][j];
                else
                    arr_sort[i][j] = arr[in2++][j];
            }

            if (in1 - i1 < n1)
            {
                for (; in1 - i1 < n1; in1++, i++)
                    arr_sort[i][j] = arr[in1][j];
            }
            else
            {
                for (; in2 - i2 < n2; in2++, i++)
                    arr_sort[i][j] = arr[in2][j];
            }
        }

        rep (i, i1, n1 + n2 + i1)
            rep (j, j1, m1 + j1)
                arr[i][j] = arr_sort[i][j];
    }
}

void merge_sort(ll n, ll m, ll i, ll j)
{
    if (n == 1 && m == 1)
        return;
    else if (n == 1)
    {
        merge_sort(n, (m / 2) + (m % 2), i, j);
        merge_sort(n, m - ((m / 2) + (m % 2)), i, j + ((m / 2) + (m % 2)));

        merge_arr(n, n, (m / 2) + (m % 2), m - ((m / 2) + (m % 2)), i, i, j, j + ((m / 2) + (m % 2)), true);
    }
    else if (m == 1)
    {
        merge_sort((n / 2) + (n % 2), m, i, j);
        merge_sort(n - ((n / 2) + (n % 2)), m, i + ((n / 2) + (n % 2)), j);

        merge_arr((n / 2) + (n % 2), n - ((n / 2) + (n % 2)), m, m, i, i + ((n / 2) + (n % 2)), j, j, false);
    }
    else
    {
        merge_sort((n / 2) + (n % 2), (m / 2) + (m % 2), i, j);
        merge_sort((n / 2) + (n % 2), m - ((m / 2) + (m % 2)), i, j + ((m / 2) + (m % 2)));
        merge_sort(n - ((n / 2) + (n % 2)), (m / 2) + (m % 2), i + ((n / 2) + (n % 2)), j);
        merge_sort(n - ((n / 2) + (n % 2)), m - ((m / 2) + (m % 2)), i + ((n / 2) + (n % 2)), j + ((m / 2) + (m % 2)));

        merge_arr((n / 2) + (n % 2), (n / 2) + (n % 2), (m / 2) + (m % 2), m - ((m / 2) + (m % 2)), i, i, j, j + ((m / 2) + (m % 2)), true);
        merge_arr(n - ((n / 2) + (n % 2)), n - ((n / 2) + (n % 2)), (m / 2) + (m % 2), m - ((m / 2) + (m % 2)), i + ((n / 2) + (n % 2)), i + ((n / 2) + (n % 2)), j, j + ((m / 2) + (m % 2)), true);

        merge_arr((n / 2) + (n % 2), n - ((n / 2) + (n % 2)), m, m, i, i + ((n / 2) + (n % 2)), j, j, false);
    }
}

void solve()
{
    ll n, m;
    cin >> n >> m;

    rep (i, 0, n)
        rep (j, 0, m)
            cin >> arr[i][j];
    
    merge_sort(n, m, 0, 0);

    rep (i, 0, n)
        rep (j, 0, m)
            cout << arr[i][j] << " ";
}

int main()
{
    fastio

    solve();
    
    return 0;
}
